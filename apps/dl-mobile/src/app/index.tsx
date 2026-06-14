import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/authStore';
import { useOnboardingStore } from '@/src/store/onboardingStore';
import OnboardingFlow from '@/src/features/onboarding/onboarding-flow';
import OnboardingScreen from '@/src/components/onboarding';

// Shaders mapped directly from your HTML configuration
const vertexShaderSource = `
  attribute vec2 position;
  varying vec2 v_texCoord;
  void main() {
    v_texCoord = position * 0.5 + 0.5;
    v_texCoord.y = 1.0 - v_texCoord.y;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  varying vec2 v_texCoord;

  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 a0 = x - floor(x + 0.5);
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = v_texCoord;
    float n1 = snoise(uv * 2.0 + u_time * 0.1);
    float n2 = snoise(uv * 4.0 - u_time * 0.15 + n1);
    
    vec3 deepRed = vec3(0.725, 0.11, 0.11); 
    vec3 brightRed = vec3(0.9, 0.15, 0.15);
    vec3 darkRed = vec3(0.3, 0.05, 0.05);
    vec3 hospitalWhite = vec3(0.98, 0.98, 1.0);
    
    float mask = smoothstep(-0.5, 0.5, n1 + n2 * 0.5);
    vec3 finalColor = mix(darkRed, deepRed, mask);
    
    float highlight = smoothstep(0.4, 0.6, n2 * 0.5 + 0.5);
    finalColor = mix(finalColor, brightRed, highlight * 0.3);
    
    float whiteMask = smoothstep(0.7, 1.0, n1);
    finalColor = mix(finalColor, hospitalWhite, whiteMask * 0.15);
    
    float pulse = pow(sin(u_time * 0.8) * 0.5 + 0.5, 8.0) * 0.05;
    finalColor += brightRed * pulse;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export default function Index() {
  const requestRef = useRef<number>(0);
  const router = useRouter();
  const { isAuthenticated, isInitialized: isAuthInitialized } = useAuthStore();
  const { 
    hasCompletedOnboarding, 
    isInitialized: isOnboardingInitialized,
    hasShownSplashThisSession,
    setHasShownSplash,
    init: initOnboarding
  } = useOnboardingStore();

  const isInitialized = isAuthInitialized && isOnboardingInitialized;

  useEffect(() => {
    initOnboarding();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    // 1. Show splash design logic
    if (!hasShownSplashThisSession) {
      const timer = setTimeout(() => {
        setHasShownSplash(true);
      }, 3500);
      return () => clearTimeout(timer);
    }

    // 2. Handle redirection if onboarding is already completed
    if (!hasCompletedOnboarding) {
       if (isAuthenticated()) {
          router.replace('/(donor)/home');
       } else {
         router.replace('/(auth)/login');
       }
    }
  }, [isInitialized, isAuthenticated(), hasCompletedOnboarding, hasShownSplashThisSession]);

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    const renderLoop = (timestamp: number) => {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform1f(timeLocation, timestamp * 0.001);
      gl.uniform2f(resolutionLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.endFrameEXP();
      requestRef.current = requestAnimationFrame(renderLoop);
    };

    requestRef.current = requestAnimationFrame(renderLoop);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // Wait for stores to initialize or show splash
  if (!isInitialized || !hasShownSplashThisSession) {
    return (
      <View className="flex-1 bg-black justify-between items-center relative">
        <GLView style={StyleSheet.absoluteFillObject} onContextCreate={onContextCreate} />
        <View style={StyleSheet.absoluteFillObject} className="bg-black/20" />
        
        <View className="flex-1 w-full" />
        <View className="items-center justify-center w-full px-margin text-center">
          <View className="mb-lg relative items-center justify-center">
            <View className="absolute w-40 h-40 bg-red-600/20 rounded-full blur-3xl" />
            <MaterialIcons name="water-drop" size={96} color="#ffffff" style={styles.iconDropShadow} />
          </View>
          <View className="items-center gap-2">
            <Text className="text-white text-4xl font-bold tracking-tight">DonorLink</Text>
            <Text className="text-white/90 text-center text-lg font-light tracking-wide">
              Ethiopia's National Blood Network
            </Text>
          </View>
        </View>

        <View className="flex-1 w-full px-margin pb-xl justify-end items-center">
          <View style={styles.glassContainer} className="flex-row items-center justify-center gap-4 rounded-full px-5 py-2.5">
             <ActivityIndicator size="small" color="#fff" />
          </View>
        </View>
      </View>
    );
  }

  // If onboarding is not completed, show the flow
  // if (!hasCompletedOnboarding) {
  //   return <OnboardingScreen />;
  // }

  // While redirecting, show a clean background
  return <View className="flex-1 bg-white" />;
}

const styles = StyleSheet.create({
  iconDropShadow: {
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  glassContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
});
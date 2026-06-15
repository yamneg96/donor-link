import React from 'react';
import { View, Pressable, Animated } from 'react-native';
import { Text } from '../ui/text';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Brain, ArrowRight, Zap } from 'lucide-react-native';
import { router } from 'expo-router';

interface ScarcityPredictionAlertProps {
  hospitalName: string;
  bloodType: string;
  riskLevel: 'medium' | 'high' | 'critical';
  recommendedUnits?: number;
}

export function ScarcityPredictionAlert({ 
  hospitalName, 
  bloodType, 
  riskLevel,
  recommendedUnits = 10
}: ScarcityPredictionAlertProps) {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const getTheme = () => {
    switch (riskLevel) {
      case 'critical': return { bg: 'bg-destructive/10', border: 'border-destructive/30', text: 'text-destructive', icon: 'text-destructive' };
      case 'high': return { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-600', icon: 'text-orange-600' };
      default: return { bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary', icon: 'text-primary' };
    }
  };

  const theme = getTheme();

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      <Pressable onPress={() => router.push({ pathname: '/(tabs)/centers', params: { bloodType } })}>
        <Card className={`overflow-hidden border-2 ${theme.border} ${theme.bg}`}>
          <CardContent className="p-4">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2">
                <View className={`p-2 rounded-lg ${riskLevel === 'critical' ? 'bg-destructive' : 'bg-primary'}`}>
                  <Brain size={18} className="text-white" />
                </View>
                <Text className={`font-bold text-sm uppercase tracking-wider ${theme.text}`}>
                  AI Prediction Alert
                </Text>
              </View>
              <Badge variant={riskLevel === 'critical' ? 'destructive' : 'outline'} className="bg-white/50">
                {riskLevel.toUpperCase()} RISK
              </Badge>
            </View>

            <Text className="text-lg font-bold mb-1">
              Shortage Predicted: Blood Type {bloodType}
            </Text>
            <Text className="text-muted-foreground text-sm leading-5">
              Intelligence models suggest a {riskLevel} supply risk for {bloodType} in your region over the next 72 hours. Your donation at <Text className="font-bold text-foreground">{hospitalName}</Text> could prevent a shortage.
            </Text>

            <View className="mt-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                <Zap size={14} className={theme.icon} />
                <Text variant="small" className={`font-bold ${theme.text}`}>
                  Pledge immediate response
                </Text>
              </View>
              <ArrowRight size={18} className={theme.icon} />
            </View>
          </CardContent>
        </Card>
      </Pressable>
    </Animated.View>
  );
}

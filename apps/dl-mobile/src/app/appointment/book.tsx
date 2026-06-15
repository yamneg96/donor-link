import React, { useState } from 'react';
import { View, ScrollView, Pressable, RefreshControl } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Text } from '../../components/ui/text';
import { Button } from '../../components/ui/button';
import { useAvailableSlots, useBookAppointment } from '../../queries/appointmentQueries';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Calendar as CalendarIcon, Clock, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { PageLoader } from '../../components/shared/PageLoader';
import { StatusModal } from '../../components/shared/StatusModal';
import { format, addDays, isSameDay } from 'date-fns';

export default function BookAppointment() {
  const { centerId, centerName } = useLocalSearchParams<{ centerId: string, centerName: string }>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  const { data: slots, isLoading, refetch } = useAvailableSlots(centerId, format(selectedDate, 'yyyy-MM-dd'));
  const bookMutation = useBookAppointment();

  const [status, setStatus] = useState<{ visible: boolean; type: 'success' | 'error'; title: string; message: string }>({
    visible: false,
    type: 'success',
    title: '',
    message: ''
  });

  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const handleBook = () => {
    if (!selectedSlot) return;

    bookMutation.mutate({
      centerId,
      date: format(selectedDate, 'yyyy-MM-dd'),
      timeSlot: selectedSlot,
    }, {
      onSuccess: () => {
        setStatus({
          visible: true,
          type: 'success',
          title: 'Appointment Booked!',
          message: `Your appointment at ${centerName} is confirmed for ${format(selectedDate, 'MMM dd')} at ${selectedSlot}.`,
        });
      },
      onError: (err: any) => {
        setStatus({
          visible: true,
          type: 'error',
          title: 'Booking Failed',
          message: err.response?.data?.message || 'Could not schedule appointment. Please try again.',
        });
      }
    });
  };

  if (isLoading && !slots) return <PageLoader message="Fetching available slots..." />;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-6 py-4 flex-row items-center bg-white border-b border-border/50">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <ChevronLeft size={24} className="text-foreground" />
        </Pressable>
        <View className="flex-1 items-center">
          <Text variant="h3" className="font-bold">Book Slot</Text>
          <Text variant="small" className="text-muted-foreground">{centerName}</Text>
        </View>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
          <Text variant="h3" className="font-bold mb-4">Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
            <View className="flex-row gap-3">
              {dates.map((date) => {
                const isSelected = isSameDay(date, selectedDate);
                return (
                  <Pressable 
                    key={date.toISOString()}
                    onPress={() => {
                      setSelectedDate(date);
                      setSelectedSlot(null);
                    }}
                    className={`items-center justify-center w-20 h-24 rounded-3xl border ${isSelected ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-muted/20 border-transparent'}`}
                  >
                    <Text className={`font-bold mb-1 ${isSelected ? 'text-white' : 'text-muted-foreground'}`}>
                      {format(date, 'EEE')}
                    </Text>
                    <Text className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-foreground'}`}>
                      {format(date, 'd')}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <Text variant="h3" className="font-bold mb-4">Available Time Slots</Text>
          <View className="flex-row flex-wrap gap-3">
            {slots?.data?.length === 0 ? (
              <View className="w-full items-center py-12 bg-muted/10 rounded-3xl border border-dashed border-muted">
                <Clock size={40} className="text-muted-foreground/30 mb-2" />
                <Text className="text-muted-foreground">No slots available for this day</Text>
              </View>
            ) : (
              slots?.data?.map((slot: string) => {
                const isSelected = selectedSlot === slot;
                return (
                  <Pressable 
                    key={slot}
                    onPress={() => setSelectedSlot(slot)}
                    className={`px-6 py-4 rounded-2xl border ${isSelected ? 'bg-primary border-primary' : 'bg-white border-border/50'}`}
                  >
                    <Text className={`font-bold ${isSelected ? 'text-white' : 'text-foreground'}`}>
                      {slot}
                    </Text>
                  </Pressable>
                );
              })
            )}
          </View>

          <View className="mt-12 mb-20 p-6 bg-primary/5 rounded-3xl border border-primary/10">
            <View className="flex-row items-center gap-3 mb-3">
              <CheckCircle2 size={20} className="text-primary" />
              <Text className="font-bold text-primary">Booking Policy</Text>
            </View>
            <Text className="text-muted-foreground leading-relaxed">
              Please arrive 15 minutes before your scheduled time. You can reschedule or cancel up to 2 hours before the appointment.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="px-6 py-4 bg-white border-t border-border/50">
        <Button 
          className="h-14 rounded-2xl" 
          disabled={!selectedSlot || bookMutation.isPending}
          onPress={handleBook}
        >
          <Text className="text-white font-bold text-lg">
            {bookMutation.isPending ? 'Confirming...' : 'Confirm Appointment'}
          </Text>
        </Button>
      </View>

      <StatusModal
        visible={status.visible}
        type={status.type}
        title={status.title}
        message={status.message}
        onClose={() => {
          setStatus({ ...status, visible: false });
          if (status.type === 'success') {
            router.push('/(tabs)/home'); // Use push instead of replace to allow back navigation if needed, or redirect to 'My Appointments'
          }
        }}
      />
    </SafeAreaView>
  );
}

import { Stack } from 'expo-router';

import { useThemeColor } from '@/hooks/use-theme-color';

export default function ExploreLayout() {
  const backgroundColor = useThemeColor(
    { light: '#FFFFFF', dark: '#0C0A09' },
    'background'
  );

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="category/[slug]" />
      <Stack.Screen name="venue/[id]" />
    </Stack>
  );
}


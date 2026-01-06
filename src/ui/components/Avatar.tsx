import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { colors } from "../tokens/colors";
import { Text } from "../primitives/Text";
import { DEFAULT_BLURHASH, IMAGE_TRANSITION_DURATION, imageSizes } from "../tokens/images";

type Props = {
  size?: number;
  uri?: string;
  name?: string; // for initials fallback
};

function initials(name?: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase()).join("") || "?";
}

export function Avatar({ size = imageSizes.avatarMd, uri, name }: Props) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.border }}
        placeholder={{ blurhash: DEFAULT_BLURHASH }}
        transition={IMAGE_TRANSITION_DURATION}
        contentFit="cover"
      />
    );
  }

  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text variant="sub" style={{ fontWeight: "700" }}>{initials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

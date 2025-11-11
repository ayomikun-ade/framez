import { StyleSheet, Text, type TextProps } from "react-native";

import { CaesarFonts, ManropeFonts } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: ManropeFonts.regular,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: ManropeFonts.semiBold,
  },
  title: {
    fontSize: 32,
    fontFamily: CaesarFonts.regular,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: ManropeFonts.bold,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a71a4",
    fontFamily: ManropeFonts.semiBold,
    textDecorationLine: "underline",
  },
});

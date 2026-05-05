import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

import { useSignOut } from "../hooks/useSignOut";
import { isPrimaryAdminEmail } from "../utils/admin";

type MenuItem = {
  label: string;
  route: string;
  icon:
    | keyof typeof Feather.glyphMap
    | keyof typeof FontAwesome.glyphMap
    | keyof typeof FontAwesome5.glyphMap
    | keyof typeof Ionicons.glyphMap
    | keyof typeof MaterialIcons.glyphMap;
  family: "feather" | "font-awesome" | "font-awesome-5" | "ionicons" | "material";
};

const SignOutButton = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const { confirmSignOut, isSigningOut } = useSignOut();
  const [menuOpen, setMenuOpen] = useState(false);

  const canSeeAdminTab = isPrimaryAdminEmail(user?.primaryEmailAddress?.emailAddress);

  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        label: "Home",
        route: "/",
        icon: "home",
        family: "font-awesome",
      },
      {
        label: "Rewards",
        route: "/rewards",
        icon: "award",
        family: "font-awesome-5",
      },
      {
        label: "Upcoming Events",
        route: "/events",
        icon: "ticket",
        family: "ionicons",
      },
      {
        label: "Best Comics",
        route: "/comics",
        icon: "book",
        family: "feather",
      },
      {
        label: "Pull List Hub",
        route: "/category",
        icon: "layers",
        family: "ionicons",
      },
      ...(canSeeAdminTab
        ? [
            {
              label: "Admin",
              route: "/admin",
              icon: "admin-panel-settings" as const,
              family: "material" as const,
            },
          ]
        : []),
    ],
    [canSeeAdminTab]
  );

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navigateTo = (route: string) => {
    setMenuOpen(false);
    router.push(route as never);
  };

  const handleSignOutPress = () => {
    setMenuOpen(false);
    confirmSignOut();
  };

  return (
    <>
      <Pressable
        onPress={() => setMenuOpen(true)}
        disabled={isSigningOut}
        hitSlop={8}
        className={`h-10 w-10 items-center justify-center rounded-full border ${
          isSigningOut ? "border-red-300 bg-red-100/80" : "border-red-200 bg-white/90"
        }`}
        style={({ pressed }) => ({
          opacity: pressed || isSigningOut ? 0.82 : 1,
          transform: [{ scale: pressed && !isSigningOut ? 0.98 : 1 }],
        })}
        accessibilityRole="button"
        accessibilityLabel={isSigningOut ? "Signing out" : "Open menu"}
      >
        <Feather name="menu" size={18} color="#be123c" />
      </Pressable>

      <Modal
        transparent
        visible={menuOpen}
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <View className="flex-1">
          <Pressable className="absolute inset-0 bg-black/35" onPress={() => setMenuOpen(false)} />

          <View className="px-4 pt-20">
            <View className="ml-auto w-[240px] rounded-3xl border border-red-100 bg-white p-3 shadow">
              <Text className="px-3 pb-2 pt-1 font-gothamBold text-base text-neutral-950">
                Duncanville Comics
              </Text>
              <Text className="px-3 pb-3 font-gothamLight text-xs text-neutral-500">
                Quick links and account actions
              </Text>

              {menuItems.map((item) => {
                const active =
                  pathname === item.route ||
                  (item.route !== "/" && pathname.startsWith(`${item.route}/`));

                return (
                  <Pressable
                    key={item.route}
                    onPress={() => navigateTo(item.route)}
                    className={`mb-2 flex-row items-center rounded-2xl px-3 py-3 ${
                      active ? "bg-red-600" : "bg-white"
                    }`}
                  >
                    <MenuIcon family={item.family} name={item.icon} active={active} />
                    <Text
                      className={`ml-3 font-gothamMedium text-sm ${
                        active ? "text-white" : "text-neutral-800"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}

              <View className="mt-1 border-t border-neutral-200 pt-3">
                <Pressable
                  onPress={handleSignOutPress}
                  className="flex-row items-center rounded-2xl bg-red-50 px-3 py-3"
                >
                  <Feather name="log-out" size={16} color="#be123c" />
                  <Text className="ml-3 font-gothamMedium text-sm text-red-700">Log out</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

function MenuIcon({
  family,
  name,
  active,
}: {
  family: MenuItem["family"];
  name: MenuItem["icon"];
  active: boolean;
}) {
  const color = active ? "#ffffff" : "#be123c";

  switch (family) {
    case "font-awesome":
      return <FontAwesome name={name as keyof typeof FontAwesome.glyphMap} size={15} color={color} />;
    case "font-awesome-5":
      return (
        <FontAwesome5 name={name as keyof typeof FontAwesome5.glyphMap} size={15} color={color} />
      );
    case "ionicons":
      return <Ionicons name={name as keyof typeof Ionicons.glyphMap} size={16} color={color} />;
    case "material":
      return (
        <MaterialIcons
          name={name as keyof typeof MaterialIcons.glyphMap}
          size={16}
          color={color}
        />
      );
    default:
      return <Feather name={name as keyof typeof Feather.glyphMap} size={16} color={color} />;
  }
}

export default SignOutButton;

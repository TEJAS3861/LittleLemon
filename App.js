import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const MENU = [
  { id: "1", name: "Greek Salad", category: "Starters", price: "$12.99", description: "Fresh vegetables with feta cheese." },
  { id: "2", name: "Bruschetta", category: "Starters", price: "$8.99", description: "Toasted bread with tomatoes and herbs." },
  { id: "3", name: "Grilled Fish", category: "Mains", price: "$18.99", description: "Fresh fish grilled with lemon." },
  { id: "4", name: "Pasta", category: "Mains", price: "$15.99", description: "Classic pasta with tomato sauce." },
  { id: "5", name: "Lemon Cake", category: "Desserts", price: "$7.99", description: "Soft cake with fresh lemon flavor." },
  { id: "6", name: "Ice Cream", category: "Desserts", price: "$6.99", description: "Creamy vanilla ice cream." },
  { id: "7", name: "Lemonade", category: "Drinks", price: "$4.99", description: "Fresh homemade lemonade." },
];

function OnboardingScreen({ onComplete }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const valid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "";

  const continueToApp = async () => {
    if (!valid) return;

    const user = { firstName, lastName, email };

    await AsyncStorage.setItem("user", JSON.stringify(user));
    onComplete(user);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.onboarding}>
        <Text style={styles.logo}>🍋 Little Lemon</Text>

        <Text style={styles.title}>Welcome to Little Lemon</Text>

        <Text style={styles.subtitle}>
          Enter your details to get started.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          style={[styles.button, !valid && styles.disabledButton]}
          disabled={!valid}
          onPress={continueToApp}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function HomeScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Starters", "Mains", "Desserts", "Drinks"];

  const filteredMenu = MENU.filter((item) => {
    const matchesCategory =
      category === "All" || item.category === category;

    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredMenu}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.homeContent}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.logo}>🍋 Little Lemon</Text>

              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate("Profile")}
              >
                <Text style={styles.profileButtonText}>Profile</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.hero}>
              <Text style={styles.heroTitle}>Little Lemon</Text>

              <Text style={styles.heroText}>
                Mediterranean food made with fresh ingredients.
                Enjoy delicious meals prepared with love.
              </Text>

              <TextInput
                style={styles.search}
                placeholder="Search menu..."
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <Text style={styles.sectionTitle}>Menu Categories</Text>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={categories}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.categories}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.category,
                    category === item && styles.selectedCategory,
                  ]}
                  onPress={() => setCategory(item)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      category === item && styles.selectedCategoryText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <Text style={styles.sectionTitle}>Food Menu</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuDescription}>
                {item.description}
              </Text>
            </View>

            <Text style={styles.price}>{item.price}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

function ProfileScreen({ navigation, user, setUser }) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);

  const saveProfile = async () => {
    const updatedUser = {
      firstName,
      lastName,
      email,
    };

    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    Alert.alert("Saved", "Your profile has been updated.");
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profile}>
        <Text style={styles.title}>Profile</Text>

        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.button} onPress={saveProfile}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function AppContent() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const loadUser = async () => {
      const savedUser = await AsyncStorage.getItem("user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    };

    loadUser();
  }, []);

  if (user === undefined) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (user === null) {
    return (
      <OnboardingScreen
        onComplete={(newUser) => setUser(newUser)}
      />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home">
          {(props) => (
            <HomeScreen
              {...props}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Profile">
          {(props) => (
            <ProfileScreen
              {...props}
              user={user}
              setUser={setUser}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return <AppContent />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  onboarding: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
  },

  profile: {
    flex: 1,
    padding: 25,
  },

  logo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#495E57",
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 25,
  },

  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#495E57",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  disabledButton: {
    backgroundColor: "#BBBBBB",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "white",
  },

  profileButton: {
    backgroundColor: "#F4CE14",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  profileButtonText: {
    fontWeight: "bold",
    color: "#333333",
  },

  hero: {
    backgroundColor: "#495E57",
    padding: 20,
  },

  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#F4CE14",
    marginBottom: 8,
  },

  heroText: {
    color: "white",
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 15,
  },

  search: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 13,
    fontSize: 16,
  },

  homeContent: {
    paddingBottom: 30,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    margin: 20,
    marginBottom: 10,
    color: "#333333",
  },

  categories: {
    paddingHorizontal: 20,
  },

  category: {
    backgroundColor: "#E5E5E5",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },

  selectedCategory: {
    backgroundColor: "#495E57",
  },

  categoryText: {
    color: "#333333",
    fontWeight: "600",
  },

  selectedCategoryText: {
    color: "white",
  },

  menuItem: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },

  menuName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  menuDescription: {
    color: "#666666",
    fontSize: 14,
    paddingRight: 10,
  },

  price: {
    fontWeight: "bold",
    color: "#495E57",
    fontSize: 15,
  },

  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
  },

  logoutButton: {
    borderWidth: 1,
    borderColor: "#D9534F",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },

  logoutText: {
    color: "#D9534F",
    fontWeight: "bold",
  },

  backButton: {
    alignItems: "center",
    padding: 15,
    marginTop: 10,
  },

  backText: {
    color: "#495E57",
    fontWeight: "bold",
  },

  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

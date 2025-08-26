import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  address: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  role_id: number | null;
  location: { latitude: number; longitude: number } | null;
}

interface AuthStore {
  // State
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  authListenerSet: boolean; // Track if auth state listener is set

  // Computed
  isAdmin: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void; // ← AGREGAR ESTA LÍNEA

  // Auth methods
  signIn: (email: string, password: string) => Promise<void>;
  signInWithProvider: (provider: "google") => Promise<void>; // ← AGREGAR ESTA LÍNEA
  signUp: (email: string, password: string, profileData?: any) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;

  // Initialization
  initialize: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        profile: null,
        session: null,
        isLoading: true,
        isAuthenticated: false,
        error: null,
        authListenerSet: false,

        // Computed
        get isAdmin() {
          // role_id 1 is admin, role_id 2 is user
          return get().profile?.role_id === 1;
        },

        // Setters
        setUser: (user) =>
          set(
            {
              user,
              isAuthenticated: !!user,
            },
            false,
            "setUser"
          ),

        setProfile: (profile) => set({ profile }, false, "setProfile"),

        setSession: (session) =>
          set(
            {
              session,
              user: session?.user || null,
              isAuthenticated: !!session?.user,
            },
            false,
            "setSession"
          ),

        setLoading: (isLoading) => set({ isLoading }, false, "setLoading"),

        setError: (error) => set({ error }, false, "setError"), // ← AGREGAR ESTA LÍNEA

        // Auth methods
        signIn: async (email: string, password: string) => {
          try {
            set({ isLoading: true, error: null });

            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error) throw error;

            if (data.user) {
              // Fetch user profile
              const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", data.user.id)
                .single();

              set({ profile: profileData as UserProfile });

              set({
                user: data.user,
                session: data.session,
                isAuthenticated: true,
              });

              toast.success("¡Bienvenido de vuelta!", {
                description: "Has iniciado sesión exitosamente.",
              });
            }
          } catch (error: any) {
            console.error("Sign in error:", error);
            set({ error: error.message });
            toast.error("Error al iniciar sesión", {
              description:
                error.message || "Por favor, verifica tus credenciales e inténtalo de nuevo.",
            });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },
        signInWithProvider: async (provider: "google") => {
          try {
            set({ isLoading: true, error: null });

            const { error } = await supabase.auth.signInWithOAuth({
              provider: provider,
              options: {
                redirectTo: `${window.location.origin}/auth-callback`,
                queryParams: {
                  access_type: "offline",
                  prompt: "consent",
                },
              },
            });

            if (error) throw error;

            // OAuth redirect will handle the rest - no success toast here
            // The auth-callback component will show the success toast
          } catch (error: any) {
            console.error("Social sign in error:", error);
            set({ error: error.message });
            toast.error("Error al iniciar sesión social", {
              description: error.message || "Por favor, inténtalo de nuevo.",
            });
            throw error;
          }
          // No finally aquí porque la página se va a redirigir
        },

        signUp: async (email: string, password: string, profileData?: any) => {
          try {
            set({ isLoading: true, error: null });

            // Sign up with Supabase Auth
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  first_name: profileData?.firstName,
                  last_name: profileData?.lastName,
                },
              },
            });

            if (error) throw error;

            if (data.user) {
              // Create profile record in profiles table
              const profileRecord = {
                id: data.user.id,
                first_name: profileData?.firstName || '',
                last_name: profileData?.lastName || '',
                email: email,
                phone: profileData?.phone || null,
                address: profileData?.address || null,
                location: profileData?.location || null,
                avatar_url: null,
                role_id: 2, // Default user role (1=admin, 2=user)
              };

              const { error: profileError } = await supabase
                .from('profiles')
                .insert([profileRecord]);

              if (profileError) {
                console.error('Profile creation error:', profileError);
                // Don't throw here as the user account was created successfully
              }

              toast.success("¡Cuenta creada exitosamente!", {
                description: "Por favor verifica tu correo para activar tu cuenta.",
              });
            }
          } catch (error: any) {
            console.error("Sign up error:", error);
            set({ error: error.message });
            toast.error("Error al crear cuenta", {
              description: error.message || "Por favor inténtalo de nuevo.",
            });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        signOut: async () => {
          try {
            console.log("🔄 Starting signOut process...");
            set({ isLoading: true });

            console.log("📤 Calling supabase.auth.signOut()...");
            const { error } = await supabase.auth.signOut();

            if (error) throw error;

            console.log("✅ Supabase signOut successful - waiting for SIGNED_OUT event...");
            // Don't call reset() here - let the auth state listener handle it
            // This prevents double reset and race conditions
            
            toast.success("Sesión cerrada", {
              description: "Has cerrado sesión exitosamente.",
            });
          } catch (error: any) {
            console.error("❌ Sign out error:", error);
            set({ isLoading: false }); // Reset loading on error
            toast.error("Error al cerrar sesión", {
              description: error.message,
            });
            throw error;
          }
          // Don't set isLoading: false here - let the reset() handle it
        },

        resetPassword: async (email: string) => {
          try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) throw error;

            toast.success("Email de restablecimiento enviado", {
              description: "Por favor, revisa tu correo para las instrucciones.",
            });
          } catch (error: any) {
            console.error("Password reset error:", error);
            toast.error("Error al restablecer contraseña", {
              description: error.message,
            });
            throw error;
          }
        },

        updateProfile: async (updates: Partial<UserProfile>) => {
          try {
            const { user, profile } = get();
            if (!user || !profile) throw new Error("Not authenticated");

            const { data, error } = await supabase
              .from("profiles")
              .update(updates)
              .eq("id", user.id)
              .select()
              .single();

            if (error) throw error;

            set({ profile: data as UserProfile });

            toast.success("Perfil actualizado", {
              description: "Tu perfil ha sido actualizado exitosamente.",
            });
          } catch (error: any) {
            console.error("Profile update error:", error);
            toast.error("Error al actualizar perfil", {
              description: error.message,
            });
            throw error;
          }
        },

        initialize: async () => {
          try {
            set({ isLoading: true });

            // Get initial session
            const {
              data: { session },
              error,
            } = await supabase.auth.getSession();
            if (error) throw error;

            if (session?.user) {
              // Fetch user profile
              const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", session.user.id)
                .single();

              if (!profileError && profileData) {
                set({
                  user: session.user,
                  session,
                  profile: profileData as UserProfile,
                  isAuthenticated: true,
                });
              }
            }

            // Only set up auth state listener once
            if (!get().authListenerSet) {
              set({ authListenerSet: true });
              
              // Listen for auth changes
              supabase.auth.onAuthStateChange(async (event, session) => {
                console.log("Auth state changed:", event, session?.user?.email);

                if (event === "SIGNED_IN" && session?.user) {
                  // Fetch profile
                  const { data: profileData } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", session.user.id)
                    .single();

                  set({
                    user: session.user,
                    session,
                    profile: profileData as UserProfile,
                    isAuthenticated: true,
                  });
                } else if (event === "SIGNED_OUT") {
                  console.log("🚪 Auth state changed: SIGNED_OUT - resetting auth store");
                  get().reset();
                }
              });
            }
          } catch (error) {
            console.error("Auth initialization error:", error);
          } finally {
            set({ isLoading: false });
          }
        },

        reset: () =>
          set(
            {
              user: null,
              profile: null,
              session: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
              authListenerSet: false, // Reset listener flag too
            },
            false,
            "reset"
          ),
      }),
      {
        name: "career-compass-auth",
        partialize: (state) => ({
          user: state.user,
          profile: state.profile,
          session: state.session,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          // Re-initialize auth on hydration
          if (state) {
            state.initialize();
          }
        },
      }
    ),
    { name: "auth-store" }
  )
);

// Helper functions
export const getAuthState = () => useAuthStore.getState();
export const isAuthenticated = () => useAuthStore.getState().isAuthenticated;
export const isAdmin = () => useAuthStore.getState().isAdmin;
export const getCurrentUser = () => useAuthStore.getState().user;
export const getCurrentProfile = () => useAuthStore.getState().profile;

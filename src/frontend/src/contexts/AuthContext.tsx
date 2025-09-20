import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import keycloak from '../config/keycloak';
import { AuthContextType, KeycloakUser } from '../types/keycloak';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

let isInitializing = false;
let isInitialized = false;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<KeycloakUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initKeycloak = async () => {
      if (isInitializing || isInitialized) {
        console.log('⏭️ Keycloak déjà initialisé ou en cours d\'initialisation');
        setLoading(false);
        return;
      }

      isInitializing = true;
      console.log('🚀 Initialisation Keycloak...');

      try {
        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          checkLoginIframe: false,
        });

        isInitialized = true;
        console.log('✅ Keycloak initialisé, authentifié:', authenticated);
        setAuthenticated(authenticated);

        if (authenticated) {
          loadUserFromToken();
          
          keycloak.onTokenExpired = () => {
            console.log('🔄 Token expiré, rafraîchissement...');
            keycloak.updateToken(30).then(() => {
              loadUserFromToken();
            });
          };
        }
      } catch (error) {
        console.error('❌ Erreur initialisation Keycloak:', error);
      } finally {
        isInitializing = false;
        setLoading(false);
      }
    };

    const loadUserFromToken = () => {
      const tokenParsed = keycloak.tokenParsed;
      console.log('🎫 Données du token:', tokenParsed);
      
      const realmRoles = tokenParsed?.realm_access?.roles || [];
      console.log('🎭 Rôles depuis token:', realmRoles);

      const userData = {
        id: tokenParsed?.sub,
        username: tokenParsed?.preferred_username,
        email: tokenParsed?.email,
        firstName: tokenParsed?.given_name,
        lastName: tokenParsed?.family_name,
        roles: realmRoles,
      };

      console.log('👤 Utilisateur final:', userData);
      setUser(userData);
    };

    initKeycloak();
  }, []);

  const login = () => {
    keycloak.login();
  };

  const logout = () => {
    keycloak.logout();
  };

  const hasRole = (role: string): boolean => {
    return keycloak.hasRealmRole(role);
  };

  const getToken = (): string | undefined => {
    return keycloak.token;
  };

  const contextValue: AuthContextType = {
    keycloak,
    authenticated,
    user,
    loading,
    login,
    logout,
    hasRole,
    getToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
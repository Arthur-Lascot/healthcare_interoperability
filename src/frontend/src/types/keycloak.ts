export interface KeycloakUser {
  id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

export interface AuthContextType {
  keycloak: any;
  authenticated: boolean;
  user: KeycloakUser | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  getToken: () => string | undefined;
}
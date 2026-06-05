import "next-auth";
declare module "next-auth" {
  interface User {
    role?: string;
    organizationId?: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      organizationId?: string;
    };
  }
}

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";


export const authOptions: NextAuthOptions = {
  debug: true,
  pages: {
    signIn: "/login", //Dẫn đến trang login custom
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async(credentials) => {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const payload = {
          email: credentials.email,
          password: credentials.password,
        };

        console.log('<<=== 🚀 payload ===>>',payload);
        //Gọi API Login  dựa trên email, password
        const res = await fetch('http://localhost:8080/api/v1/auth/login', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        //
        const tokens = await res.json();

        console.log('<<=== 🚀 tokens ===>>',tokens);
        //Check lại login thành công không
        if (!res.ok) {
          throw new Error("UnAuthorized");
        }
        // Gọi tiếp một API để lấy thông in User vừa login thành công
        if (res.ok && tokens) {
          const res = await fetch('http://localhost:8080/api/v1/auth/profile',
          {
            headers: {
              'Authorization': `Bearer ${tokens.data.token}`,
            },
          });
          let getProfile = await res.json();
          if (!res.ok) {
            throw new Error("UnAuthorized");
          }
          let user = getProfile.data;
          console.log(user);
          user = {...user, name: `${user.firstName} ${user.lastName}`}
          //cần return về thông tin user + token
          user = {...user, token: tokens.data.token, refreshToken: tokens.data.refreshToken};
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log('callbacks jwt', token, user, account,profile,isNewUser);
      if (account && user) {
        return {
          ...token,
          accessToken: user.token,
          refreshToken: user.refreshToken,
        };
      }

      return token;
    },

    async session({ session, token }) {
      console.log('callbacks session', token);
      if(token){
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.picture = token.picture;
      }
      return session;
    },
  },
};
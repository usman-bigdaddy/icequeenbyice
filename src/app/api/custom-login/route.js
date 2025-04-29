// import { cookies } from "next/headers";
// import bcrypt from "bcryptjs";
// import { signJwt } from "../../../utils/jwt"; // Ensure this function exists
// import { db } from "../../../../database/drizzle"; // Adjust path if needed
// import { users } from "../../../../database/schema";
// import { eq } from "drizzle-orm";
// import { OAuth2Client } from "google-auth-library"; // Google OAuth

// const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { email, password, provider, token } = body;

//     if (provider === "google") {
//       // Validate Google Token
//       if (!token) {
//         return new Response(JSON.stringify({ message: "Missing Google token." }), {
//           status: 400,
//           headers: { "Content-Type": "application/json" },
//         });
//       }

//       const ticket = await googleClient.verifyIdToken({
//         idToken: token,
//         audience: process.env.GOOGLE_CLIENT_ID,
//       });
//       const payload = ticket.getPayload();

//       if (!payload) {
//         return new Response(JSON.stringify({ message: "Invalid Google token." }), {
//           status: 400,
//           headers: { "Content-Type": "application/json" },
//         });
//       }

//       let [user] = await db.select().from(users).where(eq(users.email, payload.email)).limit(1);
//       if (!user) {
//         // Register new Google user if not exists
//         await db.insert(users).values({
//           email: payload.email,
//           name: payload.name,
//           passwordHash: "",
//           role: "user",
//         });

//         // Fetch the newly inserted user
//         [user] = await db.select().from(users).where(eq(users.email, payload.email)).limit(1);
//       }

//       // Generate JWT
//       const jwtToken = await signJwt({ id: user.id, email: user.email, role: user.role });

//       return new Response(
//         JSON.stringify({
//           token: jwtToken,
//           user: { id: user.id, name: user.fullName, email: user.email, role: user.role },
//         }),
//         {
//           status: 200,
//           headers: {
//             "Content-Type": "application/json",
//             "Set-Cookie": `auth_token=${jwtToken}; Path=/; HttpOnly; ${
//               process.env.NODE_ENV === "production" ? "Secure;" : ""
//             } Max-Age=${60 * 60 * 24}; SameSite=Strict`,
//           },
//         }
//       );
//     }

//     // Email/Password Login
//     if (!email || !password) {
//       return new Response(JSON.stringify({ message: "Email and password are required." }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     // Find user in database
//     const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

//     if (!user) {
//       return new Response(JSON.stringify({ message: "User not found." }), {
//         status: 404,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     // Check password
//     const isValid = await bcrypt.compare(password, user.passwordHash);
//     if (!isValid) {
//       return new Response(JSON.stringify({ message: "Incorrect password." }), {
//         status: 401,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     // Generate JWT
//     const jwtToken = await signJwt({ id: user.id, email: user.email, role: user.role });

//     return new Response(
//       JSON.stringify({
//         token: jwtToken,
//         user: { id: user.id, name: user.fullName, email: user.email, role: user.role },
//       }),
//       {
//         status: 200,
//         headers: {
//           "Content-Type": "application/json",
//           "Set-Cookie": `auth_token=${jwtToken}; Path=/; HttpOnly; ${
//             process.env.NODE_ENV === "production" ? "Secure;" : ""
//           } Max-Age=${60 * 60 * 24}; SameSite=Strict`,
//         },
//       }
//     );
//   } catch (error) {
//     console.error("Login Error:", error);
//     return new Response(JSON.stringify({ message: "Internal Server Error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { signJwt } from "../../../utils/jwt";
import { db } from "../../../../database/drizzle";
import { users } from "../../../../database/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, provider, token } = body;

    if (provider === "google") {
      // Validate Google OAuth Access Token
      if (!token) {
        return new Response(
          JSON.stringify({ message: "Missing Google token." }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const googleRes = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!googleRes.ok) {
        return new Response(
          JSON.stringify({ message: "Invalid Google access token." }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const payload = await googleRes.json(); // contains email, name, picture, etc.

      let [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, payload.email))
        .limit(1);
      if (!user) {
        // Register new Google user if not exists
        await db.insert(users).values({
          email: payload.email,
          name: payload.name,
          passwordHash: "",
          role: "USER",
        });

        // Fetch the newly inserted user
        [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, payload.email))
          .limit(1);
      }

      // Generate JWT
      const jwtToken = await signJwt({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return new Response(
        JSON.stringify({
          token: jwtToken,
          user: {
            id: user.id,
            name: user.fullName,
            email: user.email,
            role: user.role,
          },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": `auth_token=${jwtToken}; Path=/; HttpOnly; ${
              process.env.NODE_ENV === "production" ? "Secure;" : ""
            } Max-Age=${60 * 60 * 24}; SameSite=Strict`,
          },
        }
      );
    }

    // Email/password login
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return new Response(JSON.stringify({ message: "Incorrect password." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const jwtToken = await signJwt({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return new Response(
      JSON.stringify({
        token: jwtToken,
        user: {
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: user.role,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `auth_token=${jwtToken}; Path=/; HttpOnly; ${
            process.env.NODE_ENV === "production" ? "Secure;" : ""
          } Max-Age=${60 * 60 * 24}; SameSite=Strict`,
        },
      }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

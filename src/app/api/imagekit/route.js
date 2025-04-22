import ImageKit from "imagekit";
import config from "@/lib/config";
import { NextResponse } from "next/server";

// Destructure ImageKit credentials from config
const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;


const imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint });

export async function GET() {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    return NextResponse.json(authParams);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import ImageKit from "imagekit";
import config from "@/lib/config";
import { NextResponse } from "next/server";

// Destructure from config
const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint, prodApiEndpoint },
  },
} = config;

// Select endpoint based on environment
const isProduction = process.env.NODE_ENV === "production";
//const selectedEndpoint = isProduction ? prodApiEndpoint : urlEndpoint;
const selectedEndpoint = prodApiEndpoint;

// Init ImageKit
const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint: prodApiEndpoint,
});

export async function GET() {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    return NextResponse.json(authParams);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

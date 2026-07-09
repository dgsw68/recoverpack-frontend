import { apiRequest } from "./client";
import type { AuthUser, MyPackage } from "@/lib/types";

export interface MyPackagesResponse {
  items: MyPackage[];
}

export function getMe(): Promise<AuthUser> {
  return apiRequest<AuthUser>("/api/auth/me");
}

export function getMyPackages(): Promise<MyPackagesResponse> {
  return apiRequest<MyPackagesResponse>("/api/me/packages");
}

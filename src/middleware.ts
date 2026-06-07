export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    "/rooms/:id*",
    "/your-rooms",
    "/create-room",
    "/edit-room/:id*",
    "/saved",
  ],
}

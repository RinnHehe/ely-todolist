import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

export class AuthController {
  async register(body: { email: string; password: string; name?: string }) {
    const { email, password, name } = body;

    if (!email || !password) {
      return { success: false, error: "Missing email or password" };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "Email already used" };
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash: hash, name },
    });

    return {
      success: true,
      message: "Account created successfully!",
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  async login(body: { email: string; password: string }) {
    const { email, password } = body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: "Invalid credentials" };
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return { success: false, error: "Invalid credentials" };
    }

    return {
      success: true,
      message: "Login successful!",
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async forgotPassword(body: { email: string }) {
    const { email } = body;

    if (!email) {
      return { success: false, error: "Email is required" };
    }

    const user = await prisma.user.findUnique({ where: { email } });
    
    // For security, always return success even if user doesn't exist
    if (!user) {
      return { 
        success: true, 
        message: "If the email is registered, a reset link has been sent." 
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token to database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // In production, send email here with reset link
    // For now, we'll just log it (in development you can see it in console)
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}&email=${email}`;
    console.log('Password Reset Link:', resetLink);

    return {
      success: true,
      message: "If the email is registered, a reset link has been sent.",
      // Remove this in production - only for development
      resetLink,
    };
  }

  async resetPassword(body: { email: string; token: string; newPassword: string }) {
    const { email, token, newPassword } = body;

    if (!email || !token || !newPassword) {
      return { success: false, error: "Missing required fields" };
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return { success: false, error: "Invalid or expired reset token" };
    }

    // Check if token matches
    if (user.resetToken !== token) {
      return { success: false, error: "Invalid or expired reset token" };
    }

    // Check if token has expired
    if (new Date() > user.resetTokenExpiry) {
      return { success: false, error: "Reset token has expired. Please request a new one." };
    }

    // Hash new password
    const hash = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await prisma.user.update({
      where: { email },
      data: {
        passwordHash: hash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return {
      success: true,
      message: "Password reset successful!",
    };
  }
}

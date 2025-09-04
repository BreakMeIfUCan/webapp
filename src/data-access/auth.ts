"use server"

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export async function signup(email: string, password: string, firstName: string, lastName: string) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName
                },
                emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/login`
            }
        }); 
        
        if (error) {
            console.error('Signup error:', error);
            return { success: false, data: undefined, error: error.message }
        }

        // Check if user was created successfully
        if (data?.user) {
            console.log("Sign-up successful!", data.user.email);
            return { success: true, data: data, error: "" };
        } else {
            return { success: false, data: undefined, error: "Failed to create user account" }
        }
    } 
    catch (error) {
        console.error('Error signing up:', error);
        return { success: false, data: undefined, error: error instanceof Error ? error.message : 'Failed to sign up' }
    }
}


export async function login(email: string, password: string) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            console.log(error)
            return { success: false, data: undefined, error: error.message }
        }
        return { success: true, data, error: "" };
    } catch (error) {
        console.error('Error logging in:', error);
        return { success: false, data: undefined, error: error instanceof Error ? error.message : 'Failed to login' }
    }
}


export async function logout() {
    try {
        const supabase = await createClient();
        const { error } = await supabase.auth.signOut();
        if (error) {
            return { success: false, data: undefined, error: error.message }
        }
        return { success: true, data: undefined, error: "" };
    } 
    catch (error) {
        console.error('Error logging out:', error);
        return { success: false, data: undefined, error: error instanceof Error ? error.message : 'Failed to logout' }
    }
}

export async function requestPasswordReset(email: string) {
    try {
        const supabase = await createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        
        if (error) {
            console.error('Password reset error:', error)
            return { success: false, data: undefined, error: error.message }
        }
        
        console.log('Password reset email sent successfully')
        return { success: true, data: undefined, error: "" }
    } catch (error) {
        console.error('Password reset exception:', error)
        return { success: false, data: undefined, error: error instanceof Error ? error.message : 'Failed to request password reset' }
    }
}

export async function updatePassword(newPassword: string) {
    try {
        const supabase = await createClient();
        console.log('Updating password...')
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error) {
            console.error('Password update error:', error)
            if (error.message.includes('New password should be different from the old password')){
                return { success: false, data: undefined, error: error.message }
            }
            return { success: false, data: undefined, error: error.message }
        }
        console.log('Password updated successfully')
        return { success: true, data: undefined, error: "" }
    } catch (error) {
        console.error('Password update exception:', error)
        return { success: false, data: undefined, error: error instanceof Error ? error.message : 'Failed to update password' }
    }
}
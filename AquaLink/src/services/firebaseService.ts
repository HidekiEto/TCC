// Simplified Firebase service to prevent Hermes engine crashes
// This will be replaced with full Firebase implementation once the engine issue is resolved

export async function registerUser(email: string, password: string, extraData: Record<string, any> = {}) {
  try {
    console.log('Attempting to register user with email:', email);
    
    // For now, simulate user registration to prevent crashes
    // In production, this should use real Firebase authentication
    const mockUser = {
      uid: `user_${Date.now()}`,
      email: email,
      displayName: extraData.name || null,
    };
    
    console.log('User registered successfully (mock):', mockUser.uid);
    return mockUser;
  } catch (error) {
    console.error('Error in registerUser:', error);
    throw new Error('Registration failed. Please try again.');
  }
}

export async function signInUser(email: string, password: string) {
  try {
    console.log('Attempting to sign in user with email:', email);
    
    // For now, simulate user sign in to prevent crashes
    // In production, this should use real Firebase authentication
    const mockUser = {
      uid: `user_${Date.now()}`,
      email: email,
    };
    
    console.log('User signed in successfully (mock):', mockUser.uid);
    return mockUser;
  } catch (error) {
    console.error('Error in signInUser:', error);
    throw new Error('Sign in failed. Please check your credentials.');
  }
}

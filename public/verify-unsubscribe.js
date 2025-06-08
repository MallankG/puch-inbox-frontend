// Simple verification script - run this in browser console when logged into your app
async function verifyVimeoUnsubscribe() {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/unsubscribe/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 
        email: 'vimeo@vimeo.com', 
        messageId: '19722619cea8e060' 
      }),
    });
    
    if (!response.ok) {
      throw new Error('Verification failed');
    }
    
    const result = await response.json();
    console.log('Verification result:', result);
    
    if (result.verification) {
      console.log('✅ Verification completed');
      console.log('📧 Email:', result.verification.email);
      console.log('📝 Subject:', result.verification.subject);
      console.log('🔗 Has unsubscribe header:', result.verification.hasUnsubscribeHeader);
      console.log('⚡ One-click support:', result.verification.hasOneClickSupport);
      console.log('🌐 URL accessible:', result.verification.urlAccessible);
      console.log('📊 URL status:', result.verification.urlStatus);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Verification error:', error);
    return null;
  }
}

// Run the verification
console.log('🔍 Starting Vimeo unsubscribe verification...');
verifyVimeoUnsubscribe().then(result => {
  if (result) {
    console.log('🎉 Verification script completed!');
  }
});

'use client';

import Link from 'next/link';

const SplashPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
      <h1>Welcome to Workout Tracker</h1>
      <p>Your ultimate fitness companion</p>
      <div style={{ marginTop: '20px' }}>
        <Link href="/sign-up">
          <a style={{ margin: '10px', padding: '10px 20px', border: '1px solid black', borderRadius: '5px', textDecoration: 'none' }}>Sign Up</a>
        </Link>
        <Link href="/sign-in">
          <a style={{ margin: '10px', padding: '10px 20px', border: '1px solid black', borderRadius: '5px', textDecoration: 'none' }}>Sign In</a>
        </Link>
      </div>
    </div>
  );
};

export default SplashPage;

import { Redirect } from 'expo-router';
import React from 'react';

// This redirects from the root to the actual app entry point
export default function Root() {
  return <Redirect href="/home" />;
}

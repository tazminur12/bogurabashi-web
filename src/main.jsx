import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { RouterProvider } from 'react-router';
import router from './routes/router.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

// Custom scroll restoration function
const handleScrollRestoration = () => {
  // Scroll to top when routes change
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

// Add scroll restoration to router navigation
router.subscribe((state) => {
  if (state.navigation.state === 'idle') {
    handleScrollRestoration();
  }
});

// ✅ Step 3: Wrap with QueryClientProvider
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);

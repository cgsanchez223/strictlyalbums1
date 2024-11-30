import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Login';

// Mocking the AuthContext
jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Mock useNavigate at the top level
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
    const mockLogin = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks(); // Clear all mocks before each test

        // Setup auth mock
        useAuth.mockReturnValue({
            login: mockLogin,
        });

        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useNavigate: () => mockNavigate,
        }));
    });

    test('renders the login form', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        // Test form fields and button
        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
        expect(screen.getByText(/Don't have an account\?/i)).toBeInTheDocument();
    });

    test('displays validation errors when the form is submitted empty', async () => {
        render(
          <MemoryRouter>
            <Login />
          </MemoryRouter>
        );
      
        // Override the default form validation
        const form = screen.getByRole('form');
        form.noValidate = true;
      
        // Trigger form submit without filling in the fields
        fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));
      
        // Check for error message
        await waitFor(() => {
          expect(screen.getByTestId('error-message')).toBeInTheDocument();
          expect(screen.getByTestId('error-message')).toHaveTextContent('An unexpected error occurred');
        });
    });

    test('calls login and navigates on successful login', async () => {
        mockLogin.mockResolvedValue({ success: true });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        // Simulate user input for email and password
        fireEvent.change(screen.getByLabelText(/Email address/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/Password/i), {
            target: { value: 'password123' },
        });

        // Simulate button click for form submission
        fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

        // Check that login was called with the correct arguments
        await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123'));

        // Check navigation to the dashboard
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/dashboard'));
    });

    test('shows error message on failed login', async () => {
        mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' });

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        // Simulate user input for email and password
        fireEvent.change(screen.getByLabelText(/Email address/i), {
            target: { value: 'wrong@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/Password/i), {
            target: { value: 'wrongpassword' },
        });

        // Simulate button click for form submission
        fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

        // Check for error message on failed login
        expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
    });

    test('disables form elements while loading', async () => {
        mockLogin.mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 2000))
        );

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        // Simulate user input for email and password
        fireEvent.change(screen.getByLabelText(/Email address/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/Password/i), {
            target: { value: 'password123' },
        });

        // Simulate button click for form submission
        fireEvent.click(screen.getByRole('button', { name: /Sign in/i }));

        // Check that the form fields are disabled during the loading process
        expect(screen.getByLabelText(/Email address/i)).toBeDisabled();
        expect(screen.getByLabelText(/Password/i)).toBeDisabled();
        expect(screen.getByRole('button', { name: /Signing in.../i })).toBeDisabled();

        // Wait for login to complete
        await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123'));
    });
});
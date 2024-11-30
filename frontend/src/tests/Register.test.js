import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Register from '../pages/Register';

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

describe('Register Component', () => {
    const mockRegister = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useAuth.mockReturnValue({
            register: mockRegister,
        });
    });

    test('renders the registration form', () => {
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        // Check for all form elements
        expect(screen.getByText(/Create your account/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
        expect(screen.getByText(/Choose your avatar/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
    });

    test('displays error when password do not match', async () => {
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        // Fill in form with mismatched passwords
        fireEvent.change(screen.getByLabelText(/Username/i), {
            target: { value: 'testuser' },
        });
        fireEvent.change(screen.getByLabelText(/Email address/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/^Password/i), {
            target: { value: 'password123' },
        });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
            target: { value: 'password124' },
        });

        // Submit form
        fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

        // Check for error message
        expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
    });

    test('successfully registers a new user', async () => {
        mockRegister.mockResolvedValue({ success: true });

        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        // Fill in form
        fireEvent.change(screen.getByLabelText(/Username/i), {
            target: { value: 'testuser' },
        });
        fireEvent.change(screen.getByLabelText(/Email Address/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/^Password/i), {
            target: { value: 'password123' },
        });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
            target: { value: 'password123' },
        });

        // Submit form
        fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

        // Check that register was called with correct arguments
        await waitFor(() =>
            expect(mockRegister).toHaveBeenCalledWith(
                'testuser',
                'test@example.com',
                'password123',
                expect.any(String) // for avatar_url
            )
        );

        // Check navigation to dashboard
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/dashboard'));
    });

    test('shows error message on failed registration', async () => {
        mockRegister.mockResolvedValue({ success: false, error: 'Email already exists' });

        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        // Fill in form
        fireEvent.change(screen.getByLabelText(/Username/i), {
            target: { value: 'testuser' },
        });
        fireEvent.change(screen.getByLabelText(/Email Address/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/^Password/i), {
            target: { value: 'password123' },
        });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
            target: { value: 'password123' },
        });

        // Submit form
        fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

        // Check for error message
        expect(await screen.findByText(/Email already exists/i)).toBeInTheDocument();
    });

    test('handles avatar selection', () => {
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        // Get all avatar images
        const avatarImages = screen.getAllByRole('img');

        // Click the second avatar
        fireEvent.click(avatarImages[1]);

        // Check that the second avatar is selected (has the checkmark)
        const selectedAvatar = screen.getByAltText('Jean');
        expect(selectedAvatar.closest('div')).toHaveClass('hover:ring-2');
    });

    test('disables form elements while loading', async () => {
        mockRegister.mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 2000))
        );

        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        // Fill in form
        fireEvent.change(screen.getByLabelText(/Username/i), {
            target: { value: 'testuser' },
        });
        fireEvent.change(screen.getByLabelText(/Email address/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/^Password/i), {
            target: { value: 'password123' },
        });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
            target: { value: 'password123' },
        });

        // Submit form
        fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

        // Check that form elements are diable during loading
        expect(screen.getByLabelText(/Username/i)).toBeDisabled();
        expect(screen.getByLabelText(/Email address/i)).toBeDisabled();
        expect(screen.getByLabelText(/^Password/i)).toBeDisabled();
        expect(screen.getByLabelText(/Confirm Password/i)).toBeDisabled();
        expect(screen.getByRole('button', { name: /Creating account/i })).toBeDisabled();
    });
});
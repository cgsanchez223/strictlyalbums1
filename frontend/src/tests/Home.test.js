import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';

describe('Home Component', () => {
    test('renders the main heading', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        expect(screen.getByText('StrictlyAlbums')).toBeInTheDocument();
    });

    test('renders the description text', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        expect(screen.getByText(/Search and rate your favorite albums. Create playlists./i)).toBeInTheDocument();
    });

    test('renders navigation buttons with correct links', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        // Check "Get Started" button
        const getStartedButton = screen.getByText('Get Started');
        expect(getStartedButton).toBeInTheDocument();
        expect(getStartedButton.closest('a')).toHaveAttribute('href', '/register');

        // Check "Sign In" button
        const signInButton = screen.getByText('Sign In');
        expect(signInButton).toBeInTheDocument();
        expect(signInButton.closest('a')).toHaveAttribute('href', '/login');
    });

    test('buttons have correct styling classes', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        // Check "Get Started" button styling
        const getStartedButton = screen.getByText('Get Started').closest('a');
        expect(getStartedButton).toHaveClass('bg-blue-600', 'text-white');

        // Check "Sign In" button styling
        const signInButton = screen.getByText('Sign In').closest('a');
        expect(signInButton).toHaveClass('border', 'border-gray-300', 'text-gray-700');
    });

    test('has responsive layout classes', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        const buttonContainer = screen.getByText('Get Started').closest('div');
        expect(buttonContainer).toHaveClass('flex-col', 'sm:flex-row');
    });

    test('has accessible heading structure', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        const heading = screen.getByRole('heading', { name: 'StrictlyAlbums' });
        expect(heading).toBeInTheDocument();
        expect(heading.tagName).toBe('H1');
    });

    test('renders in a full-height container', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        const container = screen.getByText('StrictlyAlbums').closest('div');
        expect(container.parentElement).toHaveClass('min-h-screen');
    });  
});
import React, { Component, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

interface ErrorInfo {
    componentStack: string;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReload = () => {
        window.location.reload();
    };

    private isDevelopment = () => {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '400px',
                        textAlign: 'center',
                        p: 3,
                    }}
                >
                    <Typography variant="h4" gutterBottom color="error">
                        Oops! Something went wrong.
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        We apologize for the inconvenience. Please try reloading the page.
                    </Typography>
                    {this.isDevelopment() && this.state.error && (
                        <Typography
                            variant="body2"
                            component="pre"
                            sx={{
                                bgcolor: 'grey.100',
                                p: 2,
                                borderRadius: 1,
                                maxWidth: '100%',
                                overflow: 'auto',
                                mb: 3,
                            }}
                        >
                            {this.state.error.toString()}
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleReload}
                    >
                        Reload Page
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 
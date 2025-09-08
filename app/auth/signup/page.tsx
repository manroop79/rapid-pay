"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from './signup.module.css'; // Import the CSS module for signup page styles
import authStyles from '../auth.module.css'; // Import the CSS module for auth background

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (res.ok) {
            setSuccess(true);
            router.push('/auth/signin');
        } else {
            setError(data.message);
        }
    };

    return (
        <div className={authStyles.authBackground}>
            <div className={styles.container}>
                <h1 className="text-2xl">Sign Up</h1> {/* Move the heading outside the form container */}
                <div className={styles.formContainer}>
                    {error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>Account created successfully! You can now sign in.</p>}

                    <form onSubmit={handleSignUp}>
                        <label htmlFor="name"> Name:
                            <input 
                                type="text"
                                id="name"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required 
                                className={styles.input}
                            />
                        </label>
                        
                        <label htmlFor="email"> Email:
                            <input 
                                type="email"
                                id="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                                className={styles.input}
                            />
                        </label>

                        <label htmlFor="password"> Password:
                            <input 
                                type="password"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                                className={styles.input}
                            />
                        </label>

                        <button type="submit" className={styles.button}>
                            Sign Up
                        </button>
                    </form>

                    <p className={styles.signinLink}>
                        Already have an account? <Link href='/auth/signin'>Sign In here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
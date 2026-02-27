import React from 'react';
import { Link } from 'react-router-dom';
import useUserStore from '../../../stores/userStore';

const SmartLinkSection = () => {
    const { isAuthenticated } = useUserStore();
    return (
        <div className="relative my-[72px] flex flex-col items-center justify-center bg-smart-link-gradient text-center px-4 py-10">
                <h1 className="md:text-size-48 text-size-32 font-bold text-black mb-4">
                    Own your digital presence.
                </h1>
                <p className="text-size-16 text-black mb-8 max-w-md">
                One smart link to share everything — content, products, and your story.
                Start building with Weblinqo today.
                </p>
                <Link to={isAuthenticated ? '/dashboard' : '/signup'}>
                    <button className="border-primary bg-white border-2 border transition text-primary font-medium py-3 px-7 rounded-full shadow-md">
                        Get Started for free
                    </button>
                </Link>
        </div>
    );
};

export default SmartLinkSection;

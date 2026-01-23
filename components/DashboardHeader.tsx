import React from 'react';
import Profile from './Profile';
import Loader from './ui/Loader';
import { Button } from './ui/button';
import { useAuth } from '@/context/AuthContext';
import { Sparkles } from 'lucide-react';

export type ButtonType = { label: string; key: string; icon: React.ReactNode; style: string, onclick: () => void }

interface Props {
    Header: {
        key: string;
        title: string;
        mainTitle: string;
        subTitle: string | React.ReactNode;
        buttons: ButtonType[];
    }

}

const DashboardHeader = ({ Header }: Props) => {
    const { isAuthenticated, user, logout, loading } = useAuth();

    return (
        <div className="flex justify-between md:-mx-8 md:px-8 md:border-b md:pb-4 md:border-gray-700 md:bg-[#0f172a] md:-mt-8 md:pt-4 items-center mb-8">
            {Header?.key == "generate_ppt" ? (
                <div>
                    <div className='flex items-center gap-4' >
                        <h1 className="text-3xl font-bold tracking-tight">{Header?.title} <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">{Header?.mainTitle}</span></h1>
                        <div className="inline-flex shrink-0 items-center gap-2 px-3 py-1 rounded-full
                  bg-blue-900/30
                  border border-blue-800
                  text-blue-400
                  text-[11.5px] md:text-[10px] font-medium animate-fade-in">
                            <Sparkles size={12} />
                            <span>AI-Powered Generation</span>
                        </div>
                    </div>
                    <p className="text-gray-500 mt-1 -mb-1">{Header?.subTitle}</p>
                </div>

            ) : (
                <div >
                    <h1 className="text-3xl font-bold tracking-tight w-full">{Header?.title} <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">{Header?.key == "dashboard" ? user?.username?.split(" ")[0] : Header?.mainTitle}</span></h1>
                    <p className="text-gray-500">{Header?.subTitle}</p>
                </div>
            )

            }

            <div className="flex items-center gap-4" >
                {
                    Header?.buttons?.map((button: ButtonType, index: number) => (
                        <Button key={index}
                            onClick={() => button.onclick()}
                            className={button?.style}>
                            {/* The Shimmer Effect */}
                            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                            {button.icon}
                            <span className="font-semibold tracking-wide">{button.label}</span>
                        </Button>
                    ))
                }
                <div className="hidden ml-4 md:block">

                    {loading ? (
                        <Loader />
                    ) : (
                        <React.Fragment>
                            {isAuthenticated && (
                                <Profile user={user} logout={logout} loading={loading} />
                            )}
                        </React.Fragment>
                    )
                    }
                </div>
            </div>
        </div>
    )
}

export default DashboardHeader

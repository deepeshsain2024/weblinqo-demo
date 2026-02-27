import Gradient from '../assets/gradient.jpg';
import { BiLogoMastercard } from "react-icons/bi";
import PymtIcon from '../assets/pymticon.png';
import PayPass from '../assets/PayPass.png';
// import LogoIcon from '../assets/images/logos/gradientLogo.svg';
import { useNavigate } from 'react-router-dom';

// payment page
const PaymentPage = () => {

    const navigate = useNavigate();

    return (
        <div className="bg-[#F5F3F0] min-h-screen">
            {/* <img src={LogoIcon} alt='logo' className='h-7 ml-7 absolute top-[1.5rem]' /> */}
            <h1 className="text-2xl font-bold text-gray-900">Weblinqo</h1>
            <div className='flex items-center justify-center lg:py-8 md:py-12 py-16 px-4'>
                <div className="bg-white w-full max-w-md h-auto shadow-sm border-[1px] border-[#E9EAEB] rounded-2xl">
                    <div className='flex justify-center relative'>
                        <img src={Gradient} className='lg:h-[15rem] lg:w-[25rem] md:h-[13rem] md:w-[23rem] h-[11rem] w-[21rem] object-cover my-5 rounded-xl' />
                        <div className='lg:w-[19rem] lg:h-[11rem] md:w-[18rem] md:h-[10rem] w-[17rem] h-[9rem] absolute lg:top-[3.2rem] md:top-[3.2rem] top-[2.4rem] rounded-2xl bg-white/30 backdrop-blur-md border border-white'>
                            <div className='flex justify-between items-center mx-4 my-2'>
                                <div className='text-md text-white'>Untitled.</div>
                                <img src={PayPass} />
                            </div>
                            <div className='flex items-center mx-4 my-2 w-full absolute bottom-1 justify-between'>
                                <div className='flex flex-col'>
                                    <div className='flex justify-between items-center'>
                                        <div className='text-sm text-white'>OLIVIA RHYE</div>
                                        <div className='text-sm text-white'>06/28</div>
                                    </div>
                                    <div className='text-md text-white lg:tracking-[0.2em] md:tracking-[0.15em] tracking-[0.15em]'>1234 1234 1234 1234</div>
                                </div>
                                <div className='lg:mr-7 md:mr-6 mr-5 bg-white/5 backdrop-blur-sm px-2 rounded-lg'>
                                    <BiLogoMastercard color='white' size={'1.8rem'} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='text-[#181D27] mx-5 text-lg mb-2'>Update payment method</div>
                    <div className='text-[#717680] mx-5 text-sm font-extralight mb-5'>Update your card details.</div>
                    <form className='mx-5 mb-3'>
                        <div className='flex gap-2 mb-2'>
                            <div className='flex flex-col'>
                                <label className='text-sm text-[#414651] mb-2'>Name on card</label>
                                <input type='text' placeholder='Enter name on card' className='lg:w-[17.5rem] md:w-[15rem] w-[13rem] border-[1px] border-[#D5D7DA] rounded-lg py-2.5 pl-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-200 text-gray-800 placeholder-gray-400' />
                            </div>
                            <div className='flex flex-col'>
                                <label className='text-sm text-[#414651] mb-2'>Expiry</label>
                                <div className='flex gap-1 items-center border-[1px] border-[#D5D7DA] rounded-lg py-2 lg:pl-4 md:pl-3 pl-2 transition-all duration-200 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500'>
                                    <input type='text' placeholder='Date' className='lg:w-8 md:w-11 w-9 text-sm focus:outline-none text-gray-800 placeholder-gray-400' />
                                    <div className='text-[#9ca3af]'>/</div>
                                    <input type='text' placeholder='Year' className='w-12 text-sm focus:outline-none pl-1 text-gray-800 placeholder-gray-400' />
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-2 mb-6'>
                            <div className='flex flex-col'>
                                <label className='text-sm text-[#414651] mb-2'>Card Number</label>
                                <div className='flex items-center gap-2 lg:w-[17.5rem] md:w-[15rem] w-[13rem] border-[1px] border-[#D5D7DA] rounded-lg py-2.5 pl-2 transition-all duration-200 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500'>
                                    <img src={PymtIcon} className='w-8' />
                                    <input type='text' placeholder='Enter card number' className='text-sm focus:outline-none text-gray-800 placeholder-gray-400' />
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <label className='text-sm text-[#414651] mb-2'>CVV</label>
                                <input type='text' placeholder='Enter CVV' className='lg:w-[7.1rem] md:w-23 w-28 border-[1px] border-[#D5D7DA] rounded-lg py-2.5 pl-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all duration-200 text-gray-800 placeholder-gray-400' />
                            </div>
                        </div>
                        <div className='flex gap-3 mb-4'>
                            <button onClick={() => navigate('/dashboard')} className='w-full py-2.5 border-[1px] border-[#D5D7DA] rounded-xl text-[#414651] text-md font-medium cursor-pointer'>Cancel</button>
                            <button className='w-full py-2.5 border-[1px] border-[#7F56D9] bg-[#7F56D9] rounded-xl text-md font-medium text-white cursor-pointer'>Update</button>
                        </div>
                    </form>
                </div>
                
            </div>
        </div>
    );
}

export default PaymentPage;
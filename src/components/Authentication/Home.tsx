import { FC, ReactElement } from "react"
import Marquee from "react-fast-marquee"
import { Link,} from "react-router-dom"


const Home: FC = (): ReactElement => {
    return (
        <>
            {/* hero */}
            <div className="relative h-[60vh]">
                <video  className="absolute -z-10 -top-20  w-full hidden md:block" autoPlay muted loop>
                    <source src="/video/small.mp4" type="video/mp4" />
                </video>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32 backdrop-filter backdrop-blur-sm bg-opacity-10">
                    <p className="mx-auto -mt-4 max-w-2xl text-lg tracking-tight md:text-white  sm:mt-6">Welcome to
                        <span className="border-b border-dotted border-slate-300"> ITSYBIZZ</span>
                    </p>

                    <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight md:text-white  sm:text-7xl">
                        <span className="inline-block">Transform Your
                            <span className="relative whitespace-nowrap text-blue-600">
                                <svg aria-hidden="true" viewBox="0 0 418 42" className="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70" preserveAspectRatio="none"><path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path></svg>
                                <span className="relative"> Workflow</span></span>
                        </span>
                        <span className="inline-block">with Real-Time Automation</span>
                    </h1>

                    <p className="mx-auto mt-9 max-w-2xl text-lg tracking-tight md:text-white  sm:mt-6">
                        <span className="inline-block">Empower your team with cutting-edge automation tools that streamline processes, boost productivity, and enhance efficiency.</span>
                    </p>

                    <div className="mt-12 flex flex-col justify-center gap-y-5 sm:mt-10 sm:flex-row sm:gap-y-0 sm:gap-x-6">
                        <Link className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-slate-900 text-white  hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900 animate-fade-in-left"
                            to="/register">

                            <span className="">Get Started</span>
                        </Link>
                      
                        
                    </div>

                </div>
            </div>

            {/* clients */}


            <section>
                <div className='mx-auto w-full my-20 px-2 md:px-10'>
                    <h2 className='subscription-font text-center text-2xl md:text-4xl font-medium text-[#a7a7a7]'>We have 60+ active users across the nation</h2>
                    <div className="mt-6 md:mt-16">
                        <Marquee play>
                            <img className="mx-6 h-[4rem] object-cover" src="/client/client1.png"></img>
                            <img className="mx-6 h-[4rem] object-cover" src="/client/client2.webp"></img>
                            <img className="mx-6 h-[4rem] object-cover" src="/client/client3.webp"></img>
                            <img className="mx-6 w-[8rem] object-cover" src="/client/client4.webp"></img>
                            <img className="mx-6 h-[4rem] object-cover" src="/client/client5.webp"></img>
                            <img className="mx-6 h-[4rem] object-cover" src="/client/client6.png"></img>
                            <img className="mx-6 h-[4rem] object-cover" src="/client/client7.png"></img>
                            <img className="mx-6 w-[8rem] object-cover" src="/client/client8.webp"></img>
                            <img className="mx-6 h-[4rem] object-cover" src="/client/client9.png"></img>
                        </Marquee>
                    </div>
                </div>
            </section>

            {/* How Real-Time Automation Works*/}

            <div className="relative overflow-hidden pt-16 pb-32 space-y-24 ">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl text-center">
                    How Real-Time Automation Works
                </h2>

                <div className="relative">
                    <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8 ">
                        <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0 ">

                            <div>
                                <div>
                                    <span className="flex h-28 w-28  items-center justify-center rounded-xl ">
                                        <img src="/images/h1.png" alt="" className="size-full" />

                                    </span>
                                </div>

                                <div className="mt-6">
                                    <h2 className="text-3xl font-bold tracking-tight ">
                                        Identify automation opportunities in your workflow
                                    </h2>
                                    <p className="mt-4 text-lg text-gray-500">
                                        Start by evaluating your workflow to identify repetitive tasks and bottlenecks. Our system helps pinpoint areas where automation can provide immediate value, streamlining operations and reducing inefficiencies.
                                    </p>
                                    <div className="mt-6">
                                        <a className="inline-flex rounded-lg bg-[#0f172a] px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-[#0f172a] hover:bg-pink-700 hover:ring-pink-700"
                                            href="/login">
                                            Learn More
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 sm:mt-16 lg:mt-0">
                            <div className="-mr-48 pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                                <img loading="lazy" width="647" height="486"
                                    className="w-full rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                                    style={{ color: "transparent" }} src="/images/hh2.jpg" />
                            </div>
                        </div>
                    </div>
                </div>



                <div className="relative">
                    <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8 ">
                        <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0 lg:col-start-2">
                            <div>
                                <div>
                                    <span className="flex h-28 w-28  items-center justify-center rounded-xl ">
                                        <img src="/images/h2.png" alt="" className="size-full" />

                                    </span>
                                </div>
                                <div className="mt-6">
                                    <h2 className="text-3xl font-bold tracking-tight ">
                                        Implement our automation tools and connect with existing systems
                                    </h2>
                                    <p className="mt-4 text-lg text-gray-500">
                                        Once automation opportunities are identified, easily integrate our tools into your existing systems. No technical expertise required—our platform offers a simple setup that connects seamlessly with your current software and workflows.
                                    </p>
                                    <div className="mt-6">
                                        <a className="inline-flex rounded-lg bg-[#0f172a] px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-[#0f172a] hover:bg-pink-700 hover:ring-pink-700"
                                            href="/login">
                                            Learn More
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 sm:mt-16 lg:mt-0">
                            <div className="-ml-48 pr-6 md:-ml-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                                <img alt="Inbox user interface" loading="lazy" width="647" height="486"
                                    className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                                    src="/images/hh3.jpg" />
                            </div>
                        </div>
                    </div>
                </div>



                <div className="relative">
                    <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8 ">
                        <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0 ">
                            <div>
                                <div>
                                    <span className="flex h-28 w-28  items-center justify-center rounded-xl ">
                                        <img src="/images/h3.png" alt="" className="size-full" />

                                    </span>
                                </div>
                                <div className="mt-6">
                                    <h2 className="text-3xl font-bold tracking-tight ">
                                        Monitor and adjust through real-time analytics.
                                    </h2>
                                    <p className="mt-4 text-lg text-gray-500">
                                        With real-time monitoring tools, track the performance of your automated processes. Use live analytics to make data-driven decisions and optimize workflows continually, ensuring your system runs at peak efficiency.
                                    </p>
                                    <div className="mt-6">
                                        <a className="inline-flex rounded-lg bg-[#0f172a] px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-[#0f172a] hover:bg-pink-700 hover:ring-pink-700"
                                            href="/login">
                                            Learn More
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 sm:mt-16 lg:mt-0">
                            <div className="-mr-48 pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                                <img loading="lazy" width="646" height="485"
                                    className="w-full rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                                    src="/images/hh4.jpg" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8 ">
                        <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0 lg:col-start-2">
                            <div>
                                <div>
                                    <span className="flex h-28 w-28  items-center justify-center rounded-xl ">
                                        <img src="/images/h4.png" alt="" className="size-full" />

                                    </span>
                                </div>
                                <div className="mt-6">
                                    <h2 className="text-3xl font-bold tracking-tight ">
                                        Enjoy continuous improvements and optimization.
                                    </h2>
                                    <p className="mt-4 text-lg text-gray-500">
                                        Enjoy the benefits of automation with faster operations, fewer manual errors, and higher productivity. Your business can now operate 24/7 without interruptions, improving both speed and quality.
                                    </p>
                                    <div className="mt-6">
                                        <a className="inline-flex rounded-lg bg-[#0f172a] px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-[#0f172a] hover:bg-pink-700 hover:ring-pink-700"
                                            href="/login">
                                            Learn More
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 sm:mt-16 lg:mt-0">
                            <div className="-ml-48 pr-6 md:-ml-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                                <img alt="Inbox user interface" loading="lazy" width="647" height="486"
                                    className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                                    src="/images/hh1.avif" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Why Choose Real-Time Automation */}

            <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Why Choose Real-Time Automation?
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                        Discover the key benefits of using real-time automation to improve your operations and boost productivity.
                    </p>


                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">

                        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                            <div className="flex justify-center mb-6">
                                <img src="/images/timer.png" alt="clock" className="h-16 w-16" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Instant Results</h3>
                            <p className="mt-4 text-gray-600">
                                Automate tasks instantly to improve response times and boost overall efficiency across teams.
                            </p>
                        </div>


                        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                            <div className="flex justify-center mb-6">
                                <img src="/images/Seamless.png" alt="clock" className="h-16 w-16" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Seamless Integration</h3>
                            <p className="mt-4 text-gray-600">
                                Our platform integrates easily with your existing systems, so you can get started quickly with minimal disruption.
                            </p>
                        </div>


                        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                            <div className="flex justify-center mb-6">
                                <img src="/images/data-driven.png" alt="clock" className="h-16 w-16" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Data-Driven Insights</h3>
                            <p className="mt-4 text-gray-600">
                                Gain actionable insights from real-time data to make better business decisions and optimize workflows.
                            </p>
                        </div>


                        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                            <div className="flex justify-center mb-6">
                                <img src="/images/scale.png" alt="clock" className="h-16 w-16" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Scalability</h3>
                            <p className="mt-4 text-gray-600">
                                Scale your automation solution as your business grows, with flexible options tailored to your needs.
                            </p>
                        </div>


                        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                            <div className="flex justify-center mb-6">
                                <img src="/images/clock.png" alt="clock" className="h-16 w-16" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">24/7 Operations</h3>
                            <p className="mt-4 text-gray-600">
                                Automate your workflows to run around the clock, increasing efficiency without the need for human intervention.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

           


        </>
    )
}

export default Home

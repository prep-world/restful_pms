import React from "react";
import { Search, Calendar, Bus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Link from "next/link";

const HomePage: React.FC = () => {
   return (
      <>
         <Header />
         <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
            {/* Hero Section */}
            <section className="container mx-auto px-4 pt-20 pb-16 text-center">
               <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400">
                  Travel Smarter with Our Bus Booking System
               </h1>
               <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                  Find and book the best bus routes for your journey with
                  real-time tracking and convenient online booking.
               </p>
               <div className="flex flex-wrap justify-center gap-4">
                  <Button
                     size="lg"
                     asChild
                     className="bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-colors shadow-md"
                  >
                     <Link href="/search">Book a Trip</Link>
                  </Button>
                  <Button
                     size="lg"
                     variant="outline"
                     asChild
                     className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                  >
                     <Link href="/bookings">View My Bookings</Link>
                  </Button>
               </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
               <div className="container mx-auto px-4">
                  <h2 className="text-3xl font-bold text-center mb-12">
                     Why Choose Us
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                     <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                           <div className="flex flex-col items-center text-center">
                              <div className="bg-bus-primary/10 p-4 rounded-full mb-4">
                                 <Search className="h-8 w-8 text-bus-primary" />
                              </div>
                              <h3 className="text-xl font-semibold mb-2">
                                 Easy Search
                              </h3>
                              <p className="text-gray-600">
                                 Quickly find the best routes and buses for your
                                 journey
                              </p>
                           </div>
                        </CardContent>
                     </Card>

                     <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                           <div className="flex flex-col items-center text-center">
                              <div className="bg-bus-primary/10 p-4 rounded-full mb-4">
                                 <Calendar className="h-8 w-8 text-bus-primary" />
                              </div>
                              <h3 className="text-xl font-semibold mb-2">
                                 Simple Booking
                              </h3>
                              <p className="text-gray-600">
                                 Book your tickets in advance with just a few
                                 clicks
                              </p>
                           </div>
                        </CardContent>
                     </Card>

                     <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                           <div className="flex flex-col items-center text-center">
                              <div className="bg-bus-primary/10 p-4 rounded-full mb-4">
                                 <Bus className="h-8 w-8 text-bus-primary" />
                              </div>
                              <h3 className="text-xl font-semibold mb-2">
                                 Track Your Bus
                              </h3>
                              <p className="text-gray-600">
                                 Real-time tracking to know exactly where your
                                 bus is
                              </p>
                           </div>
                        </CardContent>
                     </Card>

                     <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                           <div className="flex flex-col items-center text-center">
                              <div className="bg-bus-primary/10 p-4 rounded-full mb-4">
                                 <Clock className="h-8 w-8 text-bus-primary" />
                              </div>
                              <h3 className="text-xl font-semibold mb-2">
                                 Save Time
                              </h3>
                              <p className="text-gray-600">
                                 No more waiting in long queues at bus stations
                              </p>
                           </div>
                        </CardContent>
                     </Card>
                  </div>
               </div>
            </section>

            {/* Popular Routes Section */}
            <section className="py-16 bg-gray-50">
               <div className="container mx-auto px-4">
                  <h2 className="text-3xl font-bold text-center mb-12">
                     Popular Routes
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {popularRoutes.map((route, index) => (
                        <Link
                           href={`/search?from=${route.from}&to=${route.to}`}
                           key={index}
                        >
                           <Card className="hover:shadow-lg transition-all cursor-pointer border-none shadow-md">
                              <CardContent className="p-0">
                                 <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                       <div className="text-xl font-semibold">
                                          {route.from}
                                       </div>
                                       <div className="text-gray-400">→</div>
                                       <div className="text-xl font-semibold">
                                          {route.to}
                                       </div>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                       <div className="text-gray-500">
                                          From ${route.price}
                                       </div>
                                       <div className="text-gray-500">
                                          {route.duration}
                                       </div>
                                    </div>
                                 </div>
                              </CardContent>
                           </Card>
                        </Link>
                     ))}
                  </div>
                  <div className="text-center mt-10">
                     <Button asChild>
                        <Link href="/search">View All Routes</Link>
                     </Button>
                  </div>
               </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-16 bg-bus-primary text-white">
               <div className="container mx-auto px-4 text-center">
                  <h2 className="text-3xl font-bold mb-6">
                     Ready to Start Your Journey?
                  </h2>
                  <p className="text-xl max-w-2xl mx-auto mb-10 text-white/90">
                     Book your next bus ride today and experience the
                     convenience of our online booking system.
                  </p>
                  <Button
                     size="lg"
                     variant="secondary"
                     asChild
                  >
                     <Link href="/search">Book Now</Link>
                  </Button>
               </div>
            </section>
         </div>
      </>
   );
};

// Sample data for popular routes
const popularRoutes = [
   { from: "New York", to: "Washington", price: 45, duration: "3h 30m" },
   { from: "Boston", to: "New York", price: 35, duration: "4h 15m" },
   { from: "Philadelphia", to: "Pittsburgh", price: 42, duration: "5h 45m" },
   { from: "Chicago", to: "Detroit", price: 38, duration: "4h 30m" },
   { from: "Miami", to: "Orlando", price: 30, duration: "3h 45m" },
   { from: "Los Angeles", to: "San Francisco", price: 55, duration: "6h 30m" },
];

export default HomePage;

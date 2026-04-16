

'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { DollarSign, Mail, User, Wallet, Trophy, QrCode } from "lucide-react";

// In a real app, this would come from your auth context or a server call
const user = {
    name: 'Vardaan Saxena',
    email: 'vardaansaxena096@Gmail.com',
    upiId: 'vardaansaxena096@finovo',
    balance: 0,
    points: 0,
};

const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

export default function SettingsPage() {
    return (
        <div className="space-y-8">
             <header>
                <h1 className="text-3xl font-bold font-headline">Account Settings</h1>
                <p className="text-muted-foreground">Manage your profile and account details.</p>
            </header>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Details</CardTitle>
                            <CardDescription>Update your personal information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" defaultValue={user.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" defaultValue={user.email} readOnly />
                            </div>
                             <Button>Update Profile</Button>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Manage your password and two-factor authentication.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" />
                            </div>
                             <Button>Change Password</Button>
                        </CardContent>
                    </Card>

                </div>

                <div className="space-y-8">
                    <Card className="text-center">
                        <CardContent className="p-6">
                            <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-primary">
                                <AvatarImage src={userAvatar?.imageUrl} alt={user.name} data-ai-hint={userAvatar?.imageHint} />
                                <AvatarFallback><User size={40}/></AvatarFallback>
                            </Avatar>
                            <h2 className="text-2xl font-bold font-headline">{user.name}</h2>
                            <p className="text-muted-foreground">{user.email}</p>
                        </CardContent>
                    </Card>
                    <Card>
                         <CardHeader className="flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Balance</CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">FC {user.balance.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                         <CardHeader className="flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">UPI ID</CardTitle>
                            <QrCode className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-mono">{user.upiId}</div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Reward Points</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{user.points.toLocaleString()} pts</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

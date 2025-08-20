import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Smartphone, 
  Send, 
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const PaymentSection = () => {
  const { toast } = useToast();
  const [paymentData, setPaymentData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    transactionId: '',
    service: '',
    notes: ''
  });

  const handlePaymentNotification = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create mailto link for payment notification
    const subject = encodeURIComponent(`Whish Money Payment Notification - ${paymentData.name}`);
    const body = encodeURIComponent(
      `Payment Notification Details:\n\n` +
      `Name: ${paymentData.name}\n` +
      `Email: ${paymentData.email}\n` +
      `Phone: ${paymentData.phone}\n` +
      `Amount: ${paymentData.amount} LBP\n` +
      `Service: ${paymentData.service}\n` +
      `Whish Money Transaction ID: ${paymentData.transactionId}\n\n` +
      `Additional Notes:\n${paymentData.notes}\n\n` +
      `Please confirm receipt of this payment.`
    );
    const mailtoLink = `mailto:GiyuTeamByJomaa@gmail.com?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoLink;
    
    toast({
      title: "Payment Notification Sent",
      description: "Your email client should open with the payment details ready to send.",
    });
    
    // Reset form
    setPaymentData({
      name: '',
      email: '',
      phone: '',
      amount: '',
      transactionId: '',
      service: '',
      notes: ''
    });
  };


  return (
    <section id="payment" className="py-20 bg-gradient-to-b from-muted to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Easy <span className="text-dojo-red">Payments</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Pay for classes and services conveniently using Whish Money
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Whish Money Payment Instructions */}
          <div>
            <Card className="border-dojo-red/20 bg-gradient-to-br from-dojo-red/5 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-dojo-red">
                  <Smartphone className="w-6 h-6" />
                  Pay with Whish Money
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-background rounded-lg p-4 border border-border/50">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-dojo-red" />
                    How to Pay
                  </h4>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Open your Whish Money app</li>
                    <li>Select "Send Money" or "Pay Bills"</li>
                    <li>Send payment to: <strong className="text-foreground">+961-70520091</strong></li>
                    <li>Enter the amount for your selected service</li>
                    <li>Complete the transaction</li>
                    <li>Fill out the notification form below</li>
                  </ol>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-green-800 mb-1">Secure & Regulated</h5>
                      <p className="text-sm text-green-700">
                        Whish Money is regulated by the Central Bank of Lebanon, ensuring secure transactions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-blue-800 mb-1">Payment Recipient</h5>
                      <p className="text-sm text-blue-700 mb-2">
                        <strong>Name:</strong> Giyu Team By Jomaa<br />
                        <strong>Phone:</strong> +961-70520091
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Notification Form */}
          <div>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Send className="w-6 h-6 text-dojo-red" />
                  Payment Notification
                </CardTitle>
                <p className="text-muted-foreground">
                  After completing your Whish Money payment, please fill out this form to notify us.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePaymentNotification} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-foreground">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={paymentData.name}
                      onChange={(e) => setPaymentData({...paymentData, name: e.target.value})}
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-foreground">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={paymentData.email}
                        onChange={(e) => setPaymentData({...paymentData, email: e.target.value})}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-foreground">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+961-XXXXXXXX"
                        value={paymentData.phone}
                        onChange={(e) => setPaymentData({...paymentData, phone: e.target.value})}
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount" className="text-foreground">Amount Paid (LBP) *</Label>
                      <Input
                        id="amount"
                        type="text"
                        placeholder="50,000"
                        value={paymentData.amount}
                        onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="service" className="text-foreground">Service *</Label>
                      <Input
                        id="service"
                        type="text"
                        placeholder="e.g., Monthly Membership"
                        value={paymentData.service}
                        onChange={(e) => setPaymentData({...paymentData, service: e.target.value})}
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="transactionId" className="text-foreground">Whish Money Transaction ID *</Label>
                    <Input
                      id="transactionId"
                      type="text"
                      placeholder="Transaction reference number from Whish Money"
                      value={paymentData.transactionId}
                      onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})}
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="notes" className="text-foreground">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional information about your payment or service request..."
                      rows={4}
                      value={paymentData.notes}
                      onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                      className="mt-2"
                    />
                  </div>
                  
                  <Button type="submit" variant="dojo" size="lg" className="w-full">
                    <Send className="w-5 h-5" />
                    Notify Payment Completed
                  </Button>
                  
                  <p className="text-sm text-muted-foreground text-center">
                    This will send an email notification to confirm your payment
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;
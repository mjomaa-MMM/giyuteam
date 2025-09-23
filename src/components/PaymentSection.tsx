import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Smartphone, 
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";

const PaymentSection = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // WHIsh Money API Configuration
  const WHISH_API_BASE = 'https://whish.money/itel-service/api';
  const WHISH_HEADERS = {
    'Content-Type': 'application/json',
    'channel': 'web', // This would be provided by WHIsh
    'secret': 'your-secret-key', // This would be provided by WHIsh
    'websiteurl': window.location.origin
  };

  const generatePaymentLink = async () => {
    setIsProcessingPayment(true);
    
    try {
      const response = await fetch(`${WHISH_API_BASE}/payment/collect`, {
        method: 'POST',
        headers: WHISH_HEADERS,
        body: JSON.stringify({
          amount: 50000, // Default amount
          currency: 'LBP',
          invoice: 'Giyu Team Karate Classes',
          externalld: Date.now(), // Unique transaction ID
          successCallbackUrl: `${window.location.origin}/payment-success`,
          failureCallbackUrl: `${window.location.origin}/payment-failure`,
          successRedirectUrl: `${window.location.origin}/?payment=success`,
          failureRedirectUrl: `${window.location.origin}/?payment=failed`
        })
      });

      const result = await response.json();
      
      if (result.status && result.data?.collectUrl) {
        window.open(result.data.collectUrl, '_blank');
        toast({
          title: "Payment Link Generated",
          description: "Opening WHIsh Money payment page in a new tab.",
        });
      } else {
        throw new Error(result.dialog?.message || 'Failed to generate payment link');
      }
    } catch (error) {
      console.error('Payment link generation failed:', error);
      toast({
        title: "Payment Link Failed",
        description: "Unable to generate payment link. Please try manual payment method.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const openWhishApp = () => {
    // Try to open WHIsh app with deep link scheme, fallback to download page
    const whishAppUrl = 'whish://';
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.whish.money';
    const appStoreUrl = 'https://apps.apple.com/app/whish-money/id1234567890';
    
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    // Try to open the app using deep link
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = whishAppUrl;
    document.body.appendChild(iframe);
    
    // Clean up iframe after attempt
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
    
    // Fallback to appropriate app store after delay
    setTimeout(() => {
      let fallbackUrl = 'https://whish.money/download/';
      
      if (isAndroid) {
        fallbackUrl = playStoreUrl;
      } else if (isIOS) {
        fallbackUrl = appStoreUrl;
      }
      
      window.open(fallbackUrl, '_blank');
    }, 2000);
    
    toast({
      title: "Opening WHIsh App",
      description: "If the app doesn't open, you'll be redirected to download it.",
    });
  };

  return (
    <section id="payment" className="py-20 bg-gradient-to-b from-muted to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('payment.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('payment.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Whish Money Payment Instructions */}
          <Card className="border-dojo-red/20 bg-gradient-to-br from-dojo-red/5 to-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-dojo-red">
                <Smartphone className="w-6 h-6" />
                {t('payment.instructions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Payment Buttons */}
              <div className="grid sm:grid-cols-2 gap-3">
                <Button 
                  onClick={generatePaymentLink}
                  disabled={isProcessingPayment}
                  variant="dojo" 
                  className="w-full"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay Online
                    </>
                  )}
                </Button>
                <Button 
                  onClick={openWhishApp}
                  variant="outline" 
                  className="w-full border-dojo-red text-dojo-red hover:bg-dojo-red hover:text-white"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Open WHIsh App
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="bg-background rounded-lg p-4 border border-border/50">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-dojo-red" />
                  How to Pay
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Choose "Pay Online" for instant payment or "Open WHIsh App" for mobile payment</li>
                  <li>For app payment: Send money to <strong className="text-foreground">+961-70520091</strong></li>
                  <li>Enter the amount for your selected service</li>
                  <li>Complete the transaction</li>
                  <li>Contact us to confirm your payment</li>
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
      </div>
    </section>
  );
};

export default PaymentSection;
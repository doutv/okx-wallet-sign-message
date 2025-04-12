'use client'
import { useState } from "react";
import { OKXUniversalConnectUI } from "@okxconnect/ui";

export default function Home() {
  const [message, setMessage] = useState("Welcome to BTC");
  const [signature, setSignature] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSign = async () => {
    try {
      setIsLoading(true);
      const okxUniversalConnectUI = await OKXUniversalConnectUI.init({
        dappMetaData: {
          icon: "https://static.okx.com/cdn/assets/imgs/247/58E63FEA47A2B7D7.png",
          name: "OKX Message Signer"
        },
        actionsConfiguration: {
          returnStrategy: 'tg://resolve',
          modals: "all"
        },
        language: "en_US",
      });

      // Add signature result listener
      okxUniversalConnectUI.on("connect_signResponse", (signResponse: any) => {
        console.log(signResponse);
        setSignature(signResponse[0].result);
        setIsLoading(false);
      });

      await okxUniversalConnectUI.openModalAndSign(
        {
          namespaces: {
            btc: {
              chains: ["btc:mainnet"],
            }
          },
          sessionConfig: {
            redirect: "tg://resolve"
          }
        },
        [
          {
            method: "btc_signMessage",
            chainId: "btc:mainnet",
            params: {
              message: message
            }
          }
        ]
      );
    } catch (error) {
      console.error("Signing error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">OKX Message Signer</h1>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message to Sign
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Enter your message here..."
            />
          </div>

          <button
            onClick={handleSign}
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing..." : "Sign Message"}
          </button>

          {signature && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h2 className="text-sm font-medium text-gray-700 mb-2">Signature:</h2>
              <p className="text-sm break-all font-mono">{signature}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

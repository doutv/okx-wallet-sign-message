'use client'
import { useState } from "react";
import { OKXUniversalConnectUI } from "@okxconnect/ui";
import { OKXBtcProvider } from "@okxconnect/universal-provider";

export default function Home() {
  const [message, setMessage] = useState("");
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
      const okxBtcProvider = new OKXBtcProvider(okxUniversalConnectUI)

      if (!okxUniversalConnectUI.connected()) {
        await okxUniversalConnectUI.openModal(
          {
            namespaces: {
              btc: {
                chains: ["btc:mainnet"],
              },
            },
            sessionConfig: {
              redirect: "tg://resolve"
            }
          },
        );
      }

      const result = await okxBtcProvider.signMessage("btc:mainnet", message)
      console.log(result)
      setSignature(result as string)
      setIsLoading(false)
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
          <div className="bg-yellow-50 p-4 rounded-md mb-4">
            <h2 className="text-sm font-medium text-yellow-800 mb-2">Security Notice</h2>
            <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
              <li>Only sign messages you trust and understand</li>
              <li>Verify the message content in your OKX wallet before signing</li>
              <li>Never share your private keys or seed phrase</li>
            </ul>
          </div>

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
              <p className="text-xs text-gray-500 mt-2">
                This signature proves you own the private key that signed this message.
              </p>
            </div>
          )}
        </div>
        <div className="mt-6 text-center">
          <a
            href="https://github.com/doutv/okx-wallet-sign-message"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Verify source code on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

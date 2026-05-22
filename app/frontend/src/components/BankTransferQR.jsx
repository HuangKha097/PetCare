import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    Copy,
    CheckCircle2,
    Building2,
    CreditCard,
    User,
    FileText,
    Banknote,
    QrCode,
} from "lucide-react";

// Bank configuration
const BANK_CONFIG = {
    bankBin: "970407", // Techcombank
    bankName: "Techcombank",
    accountNo: "8880972004",
    accountName: "QUACH HOANG KHA",
    template: "XURB98D",
};

const BankTransferQR = ({ orderId, totalAmount, phone }) => {
    const { t } = useTranslation();
    const [copiedField, setCopiedField] = useState(null);

    // Build transfer content: phone (if available) + order code (if available)
    const transferContent = useMemo(() => {
        const parts = [];
        if (phone) parts.push(phone);
        if (orderId) parts.push(orderId);
        return parts.join(" - ");
    }, [orderId, phone]);

    // Build VietQR image URL
    const qrUrl = useMemo(() => {
        const baseUrl = `https://api.vietqr.io/image/${BANK_CONFIG.bankBin}-${BANK_CONFIG.accountNo}-${BANK_CONFIG.template}.jpg`;
        const params = new URLSearchParams({
            accountName: BANK_CONFIG.accountName,
            amount: Math.round(totalAmount).toString(),
        });
        if (transferContent) {
            params.set("addInfo", transferContent);
        }
        return `${baseUrl}?${params.toString()}`;
    }, [totalAmount, transferContent]);

    const handleCopy = async (text, field) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            // Fallback for older browsers
            const el = document.createElement("textarea");
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("vi-VN").format(Math.round(amount));
    };

    const bankInfoRows = [
        {
            icon: Building2,
            label: t("bank_transfer.bank"),
            value: BANK_CONFIG.bankName,
            copyable: false,
        },
        {
            icon: CreditCard,
            label: t("bank_transfer.account_no"),
            value: BANK_CONFIG.accountNo,
            copyable: true,
            copyKey: "account",
        },
        {
            icon: User,
            label: t("bank_transfer.account_holder"),
            value: BANK_CONFIG.accountName,
            copyable: false,
        },
        {
            icon: Banknote,
            label: t("bank_transfer.amount"),
            value: `${formatAmount(totalAmount)}đ`,
            copyable: true,
            copyKey: "amount",
            copyValue: Math.round(totalAmount).toString(),
        },
        {
            icon: FileText,
            label: t("bank_transfer.content"),
            value: transferContent,
            copyable: true,
            copyKey: "content",
        },
    ];

    return (
        <div className="w-full max-w-md mx-auto">
            {/* QR Code Card */}
            <div className="relative bg-white rounded-[2rem] shadow-2xl border border-surface-container-low overflow-hidden">
                {/* Header gradient */}
                <div className="bg-primary px-8 py-6 text-on-background">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-on-background/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <QrCode size={22} className="text-on-background" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black tracking-tight leading-none mb-1">
                                {t("bank_transfer.scan_to_pay")}
                            </h3>
                            <p className="text-on-background/70 text-xs font-semibold">
                                {t("bank_transfer.open_app")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* QR Image */}
                <div className="px-8 py-6 flex flex-col items-center">
                    <div className="relative p-3 bg-gradient-to-br from-amber-50/50 to-yellow-50/50 rounded-2xl border-2 border-primary/20 shadow-inner">
                        <img
                            src={qrUrl}
                            alt="VietQR Payment QR Code"
                            className="w-64 h-auto rounded-xl"
                            loading="eager"
                        />
                        {/* Subtle shine animation */}
                        <div
                            className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-pulse pointer-events-none"
                            style={{ animationDuration: "3s" }}
                        />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 mt-4">
                        Powered by VietQR
                    </p>
                </div>

                {/* Divider with dots */}
                <div className="relative px-4">
                    <div className="border-t-2 border-dashed border-surface-container-high" />
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-surface rounded-full" />
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-surface rounded-full" />
                </div>

                {/* Bank Info */}
                <div className="px-8 py-6 space-y-3">
                    {bankInfoRows.map(
                        ({
                            icon: Icon,
                            label,
                            value,
                            copyable,
                            copyKey,
                            copyValue,
                        }) => (
                            <div
                                key={label}
                                className="flex items-center justify-between gap-3 group"
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                                        <Icon
                                            size={16}
                                            className="text-on-surface-variant/60 group-hover:text-amber-600 transition-colors"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
                                            {label}
                                        </p>
                                        <p
                                            className={`text-sm font-black truncate ${copyKey === "content" || copyKey === "amount" ? "text-amber-600" : "text-on-background"}`}
                                        >
                                            {value}
                                        </p>
                                    </div>
                                </div>
                                {copyable && (
                                    <button
                                        onClick={() =>
                                            handleCopy(
                                                copyValue || value,
                                                copyKey,
                                            )
                                        }
                                        className="flex-shrink-0 p-2 rounded-lg hover:bg-primary/10 active:scale-90 transition-all"
                                        title={`Copy ${label}`}
                                    >
                                        {copiedField === copyKey ? (
                                            <CheckCircle2
                                                size={16}
                                                className="text-emerald-600 font-bold"
                                            />
                                        ) : (
                                            <Copy
                                                size={16}
                                                className="text-on-surface-variant/40 hover:text-amber-600 transition-colors"
                                            />
                                        )}
                                    </button>
                                )}
                            </div>
                        ),
                    )}
                </div>

                {/* Footer note */}
                <div className="px-8 pb-6">
                    <div className=" border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                        <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-amber-600 text-xs font-black">
                                !
                            </span>
                        </div>
                        <p className="text-xs font-medium text-amber-700 leading-relaxed">
                            {t("bank_transfer.warning_note")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BankTransferQR;

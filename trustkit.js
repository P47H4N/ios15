if (ObjC.available) {
    console.log("[*] Starting TrustKit SSL Pinning Bypass");

    // Hook SecTrustEvaluate
    var SecTrustEvaluate = new NativeFunction(
        Module.findExportByName(null, "SecTrustEvaluate"),
        "int",
        ["pointer", "pointer"]
    );

    Interceptor.replace(SecTrustEvaluate, new NativeCallback(function (trust, result) {
        console.log("[*] Hooked SecTrustEvaluate");
        // Always return 0 (trusted)
        return 0;
    }, "int", ["pointer", "pointer"]));

    // Hook SecTrustEvaluateWithError (used in modern apps)
    var SecTrustEvaluateWithError = Module.findExportByName(null, "SecTrustEvaluateWithError");
    if (SecTrustEvaluateWithError) {
        Interceptor.replace(SecTrustEvaluateWithError, new NativeCallback(function (trust, error) {
            console.log("[*] Hooked SecTrustEvaluateWithError");
            // Always return true (trusted)
            return true;
        }, "bool", ["pointer", "pointer"]));
    }
} else {
    console.log("[-] Objective-C Runtime is not available!");
}

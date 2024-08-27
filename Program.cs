using System;
using System.Runtime.InteropServices.JavaScript;

Console.WriteLine("Hello, Browser!");

// Cornflower blue
MyClass.ClearColor(0.39f, 0.58f, 0.93f, 1);
MyClass.Clear(MyClass.COLOR_BUFFER_BIT);

public partial class MyClass
{
    [JSExport]
    internal static string Greeting()
    {
        var text = $"Hello, World! Greetings from {GetHRef()}";
        Console.WriteLine(text);
        return text;
    }

    [JSImport("window.location.href", "main.js")]
    internal static partial string GetHRef();

    [JSImport("gl.clearColor", "main.js")]
    internal static partial void ClearColor(float red, float green, float blue, float alpha);

    public const int COLOR_BUFFER_BIT = 0x00004000;

    [JSImport("gl.clear", "main.js")]
    internal static partial void Clear(int mask);
}

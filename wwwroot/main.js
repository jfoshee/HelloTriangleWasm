import { dotnet } from "./_framework/dotnet.js";

// Get WebGL context from the canvas
const canvas = document.getElementById("glCanvas");
const gl =
  canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
console.assert(gl, "WebGL is not available");

const { setModuleImports, getAssemblyExports, getConfig } = await dotnet
  .withDiagnosticTracing(false)
  .withApplicationArgumentsFromQuery()
  .create();

setModuleImports("main.js", {
  gl: gl,
  utility: {
    createFloat32Array: data => new Float32Array(data),
    // Permit passing a MemoryView for the buffer which gives flexibility for binding
    glBufferData: (target, data, usage) => {
      // NOTE: calling _unsafe_create_view is supposed to be ok for immediate usage.
      //       calling slice() is safer, but makes a copy
      //       https://github.com/dotnet/runtime/blob/8cb3bf89e4b28b66bf3b4e2957fd015bf925a787/src/mono/wasm/runtime/marshal.ts#L386C5-L386C24
      gl.bufferData(target, data._unsafe_create_view(), usage);
    },
  },
  window: {
    location: {
      href: () => globalThis.window.location.href,
    },
  },
});

const config = getConfig();
const exports = await getAssemblyExports(config.mainAssemblyName);
// const text = exports.MyClass.Greeting();
// document.getElementById("out").innerHTML = text;

await dotnet.run();

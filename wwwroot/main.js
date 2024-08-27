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

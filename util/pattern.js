const getAddressByModule = (signature, handle, module) => {
  const types = memoryjs.READ | memoryjs.SUBTRACT;
  const pattern = memoryjs.findPattern(handle, module, signature, types, 0x1, 0x10);
  console.log(`0x${pattern.toString(16)}`);
}

// const modules = memoryjs.getModules(object.th32ProcessID);
// for(let i = 0; i < modules.length; i++) {
//   getAddressByModule('A9 ? ? ? A3 ?', object.handle, modules[i].szModule);
// }

// const value = memoryjs.readMemory(object.handle, 0x9e818f467d98c000, memoryjs.INT);

// console.log(value);

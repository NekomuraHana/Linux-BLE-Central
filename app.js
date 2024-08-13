const {createBluetooth} = require('node-ble')

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function scanDevice(devName,UUID){
    const {bluetooth, destroy} = createBluetooth();
    const adapter = await bluetooth.defaultAdapter();
    const targetDevice = [];
    if (! await adapter.isDiscovering()) {
      console.log('Discovering:');
      await adapter.startDiscovery();
      await wait(3000);
      console.log(await adapter.toString());
      const devices = await adapter.devices();
      if(devices.length != 0){
        let validate = null;
        for(let i=0; devices.length>i; i++){
            try {
                validate = await adapter.getDevice(devices[i]);
                validateService = await validate.helper.props();
                await validate.helper.removeAllListeners();
                console.log("service condition", validateService);
                if(validateService.Name === devName && validateService.UUIDs.includes(UUID)){
                    targetDevice.push("success");
                    targetDevice.push(validateService.Address);
                    if('RSSI' in validateService){
                        targetDevice.push(validateService.RSSI);
                    }else{
                        targetDevice.push("RSSI ERROR");
                    }
                }
            } catch (error) {
                console.log("scan get error");
                 targetDevice.push("scan get error");
            }
            validate = null;
            }
        }
        else{
            console.log("no Device aria");
            targetDevice.push("no Device aria");
        }
        await adapter.stopDiscovery();
    }
    destroy();
    if(targetDevice.length === 0){
        targetDevice.push("target not find");
    }
    return targetDevice
}

async function main() {
    while(true){
        const reslut = await scanDevice('deviceName','UUID');
        console.log(`result ${reslut}`);
    }
    
}

main();
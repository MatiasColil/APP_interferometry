# APP_interferometry

Para la instalación de Android Studio seguir indicaciones: https://reactnative.dev/docs/environment-setup?guide=native

# Ejecutar la aplicación en modo desarrollo

1. Instalar Node.js.

2. Instalar dependencias: `npm install`.

3. `npm start` para iniciar Metro/Console log y `npm run android` para ejecutar la aplicación.

4. Con Android Studio se puede elegir si ejecutar la versión debug/desarrollo o release/producción en los simuladores de dispositivos.

# Compilar la aplicación


1. Ir al directorio ` \APP_Interferometry\Interferometry\android\`
 
2. ejecutar  ` ./gradlew clean` y luego ` ./gradlew assembleRelease`

3. El .apk se encuentra en ` 'APP_Interferometry\Interferometry\android\app\build\outputs\apk\release\`

En caso de tener que volver a firmar la aplicación: https://reactnative.dev/docs/signed-apk-android


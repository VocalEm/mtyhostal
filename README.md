# mtyhostal

Este proyecto utiliza .net y react con Typescript, para el tema de multimedia utiliza un file system en cloudinary con la capa gratuita. Tambien utiliza el ORM entityFramework de .Net

-Antes de correrlo debes

1. restaurar la base de datos la cual esta echa en postgreSql con la copia de seguridad que se incluye
2. en caso de que no quieras deberas crea la base de datos en postgresql con el nombre mtyhostal_db
3. despues ejecuta el comando dotnet ef database update en la terminal estando dentro de la carpeta mtyhostal.server esto para ejecutar migraciones
4. Crear los siguientes secrets con el secret manager de visual studio

_ejecuta en consola lo siguiente_
dotnet user-secrets set "Jwt:Key" "ESTA_ES_MI_CLAVE_SECRETA_SUPER_LARGA_Y_SEGURA_12345"
dotnet user-secrets set "Cloudinary:CloudName" "dxstpixjr"
dotnet user-secrets set "Cloudinary:ApiKey" "988326543792195"
dotnet user-secrets set "Cloudinary:ApiSecret" "2xI8a18DzNOSWKvomEkSYv2OvJ4"

-Para ejecutarlo necesitas fuera de visual studio (o en visual studio code)

1. trasladarte a la carpeta de mtyhostal.server
2. ejecutar el comando dotnet run (asegurate de tener las extensiones o el sdk instalado)
3. y se ejecutara la parte del backend (es la que esta actualmente mas trabajada)

-En caso de estar en visual studio y tengas las instalaciones correctas solo debes dar click en la flechita verde

--proximamente hosteado.

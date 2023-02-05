INSERT INTO permissions (id,"name",slug,description,created_at,updated_at) VALUES
	 ('3574ad20-a355-11ed-b615-c3c8a7619f52','Create Permission','create-permission',NULL,'2023-02-02 17:56:28.276-06','2023-02-02 17:56:28.276-06'),
	 ('3acd8ad0-a355-11ed-b615-c3c8a7619f52','Update Permission','update-permission',NULL,'2023-02-02 17:56:37.246-06','2023-02-02 17:56:37.246-06'),
	 ('472db980-a355-11ed-b615-c3c8a7619f52','List Permissions','list-permissions',NULL,'2023-02-02 17:56:58.008-06','2023-02-02 17:56:58.008-06'),
	 ('4c5722c0-a355-11ed-b615-c3c8a7619f52','Get Permission','get-permission',NULL,'2023-02-02 17:57:06.668-06','2023-02-02 17:57:06.668-06'),
	 ('5ad9bc40-a355-11ed-b615-c3c8a7619f52','Create Role','create-role',NULL,'2023-02-02 17:57:31.012-06','2023-02-02 17:57:31.012-06'),
	 ('5e125200-a355-11ed-b615-c3c8a7619f52','Update Role','update-role',NULL,'2023-02-02 17:57:36.417-06','2023-02-02 17:57:36.417-06'),
	 ('62267ab0-a355-11ed-b615-c3c8a7619f52','List Role','list-role',NULL,'2023-02-02 17:57:43.259-06','2023-02-02 17:57:43.259-06'),
	 ('666b7760-a355-11ed-b615-c3c8a7619f52','Get Role','get-role',NULL,'2023-02-02 17:57:50.422-06','2023-02-02 17:57:50.422-06'),
	 ('6cec5a50-a355-11ed-b615-c3c8a7619f52','Delete Role','delete-role',NULL,'2023-02-02 17:58:01.333-06','2023-02-02 17:58:01.333-06'),
	 ('89ca7d50-a355-11ed-b615-c3c8a7619f52','Delete Permission','delete-permission',NULL,'2023-02-02 17:58:49.765-06','2023-02-02 17:58:49.765-06');
INSERT INTO permissions (id,"name",slug,description,created_at,updated_at) VALUES
	 ('dfa95e80-a355-11ed-b615-c3c8a7619f52','Create User','create-user',NULL,'2023-02-02 18:01:13.832-06','2023-02-02 18:01:13.832-06'),
	 ('e2b517e0-a355-11ed-b615-c3c8a7619f52','Update User','update-user',NULL,'2023-02-02 18:01:18.943-06','2023-02-02 18:01:18.943-06'),
	 ('e7ae7070-a355-11ed-b615-c3c8a7619f52','List Users','list-users',NULL,'2023-02-02 18:01:27.287-06','2023-02-02 18:01:27.287-06'),
	 ('eb40bef0-a355-11ed-b615-c3c8a7619f52','Get User','get-user',NULL,'2023-02-02 18:01:33.279-06','2023-02-02 18:01:33.279-06'),
	 ('f079b890-a355-11ed-b615-c3c8a7619f52','Delete User','delete-user',NULL,'2023-02-02 18:01:42.041-06','2023-02-02 18:01:42.041-06');

INSERT INTO roles (id,"name",slug,description,created_at,updated_at) VALUES
	 ('19e7fb40-a0e2-11ed-b16b-f79849cd9fd9','Root','root',NULL,'2023-01-31 16:39:17.802-06','2023-01-31 16:39:17.802-06'),
	 ('1f34f210-a0e2-11ed-b16b-f79849cd9fd9','Administrador','administrador',NULL,'2023-01-31 16:39:17.802-06','2023-01-31 16:39:17.802-06'),
	 ('276d9720-a0e2-11ed-b16b-f79849cd9fd9','Cliente','cliente',NULL,'2023-01-31 16:39:17.802-06','2023-01-31 16:39:17.802-06');

INSERT INTO public.role_permissions (id,role_id,permission_id,created_at,updated_at) VALUES
	 ('dbccd5b0-a357-11ed-a209-8bbed462e071','19e7fb40-a0e2-11ed-b16b-f79849cd9fd9','3574ad20-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:15:26.347-06','2023-02-02 18:15:26.347-06'),
	 ('dbcd23d0-a357-11ed-a209-8bbed462e071','19e7fb40-a0e2-11ed-b16b-f79849cd9fd9','3acd8ad0-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:15:26.349-06','2023-02-02 18:15:26.349-06'),
	 ('dbcd4ae0-a357-11ed-a209-8bbed462e071','19e7fb40-a0e2-11ed-b16b-f79849cd9fd9','472db980-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:15:26.35-06','2023-02-02 18:15:26.35-06'),
	 ('dbcd9900-a357-11ed-a209-8bbed462e071','19e7fb40-a0e2-11ed-b16b-f79849cd9fd9','4c5722c0-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:15:26.352-06','2023-02-02 18:15:26.352-06'),
	 ('dbcdc010-a357-11ed-a209-8bbed462e071','19e7fb40-a0e2-11ed-b16b-f79849cd9fd9','5ad9bc40-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:15:26.353-06','2023-02-02 18:15:26.353-06'),
	 ('dbcde720-a357-11ed-a209-8bbed462e071','19e7fb40-a0e2-11ed-b16b-f79849cd9fd9','5e125200-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:15:26.354-06','2023-02-02 18:15:26.354-06'),
	 ('dbce3540-a357-11ed-a209-8bbed462e071','19e7fb40-a0e2-11ed-b16b-f79849cd9fd9','62267ab0-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:15:26.356-06','2023-02-02 18:15:26.356-06'),
	 ('dbce8360-a357-11ed-a209-8bbed462e071','19e7fb40-a0e2-11ed-b16b-f79849cd9fd9','666b7760-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:15:26.358-06','2023-02-02 18:15:26.359-06'),
	 ('dbced180-a357-11ed-a209-8bbed462e071','19e7fb40-a0e2-11ed-b16b-f79849cd9fd9','6cec5a50-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:15:26.36-06','2023-02-02 18:15:26.36-06'),
	 ('dbcf1fa0-a357-11ed-a209-8bbed462e071','19e7fb40-a0e2-11ed-b16b-f79849cd9fd9','89ca7d50-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:15:26.362-06','2023-02-02 18:15:26.362-06');
INSERT INTO role_permissions (id,role_id,permission_id,created_at,updated_at) VALUES
	 ('dbcf6dc0-a357-11ed-a209-8bbed462e071','19e7fb40-a0e2-11ed-b16b-f79849cd9fd9','dfa95e80-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:15:26.364-06','2023-02-02 18:15:26.364-06'),
	 ('dbcfbbe0-a357-11ed-a209-8bbed462e071','19e7fb40-a0e2-11ed-b16b-f79849cd9fd9','e2b517e0-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:15:26.366-06','2023-02-02 18:15:26.366-06'),
	 ('dbcfe2f0-a357-11ed-a209-8bbed462e071','19e7fb40-a0e2-11ed-b16b-f79849cd9fd9','e7ae7070-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:15:26.367-06','2023-02-02 18:15:26.367-06'),
	 ('dbd00a00-a357-11ed-a209-8bbed462e071','19e7fb40-a0e2-11ed-b16b-f79849cd9fd9','eb40bef0-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:15:26.368-06','2023-02-02 18:15:26.368-06'),
	 ('dbd03110-a357-11ed-a209-8bbed462e071','19e7fb40-a0e2-11ed-b16b-f79849cd9fd9','f079b890-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:15:26.369-06','2023-02-02 18:15:26.369-06'),
	 ('45bd0b20-a358-11ed-a209-8bbed462e071','1f34f210-a0e2-11ed-b16b-f79849cd9fd9','3574ad20-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:18:24.082-06','2023-02-02 18:18:24.082-06'),
	 ('45bd5940-a358-11ed-a209-8bbed462e071','1f34f210-a0e2-11ed-b16b-f79849cd9fd9','3acd8ad0-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:18:24.084-06','2023-02-02 18:18:24.084-06'),
	 ('45bd8050-a358-11ed-a209-8bbed462e071','1f34f210-a0e2-11ed-b16b-f79849cd9fd9','472db980-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:18:24.085-06','2023-02-02 18:18:24.085-06'),
	 ('45bda760-a358-11ed-a209-8bbed462e071','1f34f210-a0e2-11ed-b16b-f79849cd9fd9','4c5722c0-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:18:24.086-06','2023-02-02 18:18:24.086-06'),
	 ('45bdce70-a358-11ed-a209-8bbed462e071','1f34f210-a0e2-11ed-b16b-f79849cd9fd9','5ad9bc40-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:18:24.087-06','2023-02-02 18:18:24.087-06');
INSERT INTO role_permissions (id,role_id,permission_id,created_at,updated_at) VALUES
	 ('45bdf580-a358-11ed-a209-8bbed462e071','1f34f210-a0e2-11ed-b16b-f79849cd9fd9','5e125200-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:18:24.088-06','2023-02-02 18:18:24.088-06'),
	 ('45be1c90-a358-11ed-a209-8bbed462e071','1f34f210-a0e2-11ed-b16b-f79849cd9fd9','62267ab0-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:18:24.089-06','2023-02-02 18:18:24.089-06'),
	 ('45be43a0-a358-11ed-a209-8bbed462e071','1f34f210-a0e2-11ed-b16b-f79849cd9fd9','666b7760-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:18:24.09-06','2023-02-02 18:18:24.09-06'),
	 ('45be91c0-a358-11ed-a209-8bbed462e071','1f34f210-a0e2-11ed-b16b-f79849cd9fd9','6cec5a50-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:18:24.092-06','2023-02-02 18:18:24.092-06'),
	 ('45beb8d0-a358-11ed-a209-8bbed462e071','1f34f210-a0e2-11ed-b16b-f79849cd9fd9','89ca7d50-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:18:24.093-06','2023-02-02 18:18:24.093-06'),
	 ('45bedfe0-a358-11ed-a209-8bbed462e071','1f34f210-a0e2-11ed-b16b-f79849cd9fd9','dfa95e80-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:18:24.094-06','2023-02-02 18:18:24.094-06'),
	 ('45bf2e00-a358-11ed-a209-8bbed462e071','1f34f210-a0e2-11ed-b16b-f79849cd9fd9','e2b517e0-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:18:24.096-06','2023-02-02 18:18:24.096-06'),
	 ('45bf5510-a358-11ed-a209-8bbed462e071','1f34f210-a0e2-11ed-b16b-f79849cd9fd9','e7ae7070-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:18:24.097-06','2023-02-02 18:18:24.098-06'),
	 ('45bfa330-a358-11ed-a209-8bbed462e071','1f34f210-a0e2-11ed-b16b-f79849cd9fd9','eb40bef0-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:18:24.099-06','2023-02-02 18:18:24.1-06'),
	 ('45bff150-a358-11ed-a209-8bbed462e071','1f34f210-a0e2-11ed-b16b-f79849cd9fd9','f079b890-a355-11ed-b615-c3c8a7619f52','2023-02-02 18:18:24.101-06','2023-02-02 18:18:24.102-06');

INSERT INTO users (id,email,"password",phone,remember_me_token,confirm_token,recover_token,confirm,"blocked",created_at,updated_at,profile_id) VALUES
	 ('36866b40-a0e4-11ed-be80-87a6daf5deaa','admin@vortexdevops.com','$argon2id$v=19$t=3,m=4096,p=1$1QeKh6hQA7I1k9xPUdw/0Q$jufTooow09QZ4V1/HOn1cT+MloIrGPEvHwtrlyxrgdM','1234567890',NULL,NULL,NULL,true,false,'2023-01-31 16:39:17.939-06','2023-02-01 13:59:38.84-06','94f8a3e4-558c-41f0-ad8d-2bd8ebde43c2'),
	 ('30556690-a314-11ed-8fbc-7fa7a206f049','alberto@vortexdevops.com','$argon2id$v=19$t=3,m=4096,p=1$5IwbI1U2+q6rzMtqyXnCKg$Hx7cq5cp60LxV/PwosiF3QIJOAeevHpidqRWMV30bPU','1231231212',NULL,NULL,NULL,true,false,'2023-02-02 10:11:02.54-06','2023-02-02 10:11:02.552-06','306d0d40-a314-11ed-8fbc-7fa7a206f049'),
	 ('d6934380-9aca-11ed-9a73-ad2ecd89790f','root@vortexdevops.com','$argon2id$v=19$t=3,m=4096,p=1$Aw4Hvh5kSlFd9wBq8j/A7A$jK6HyxZQrMNYeCiRHfLiUj08jc8aFMmFs+Cv/vHMHfU','2222062058',NULL,NULL,NULL,true,false,'2023-01-31 16:39:17.939-06','2023-01-31 16:39:18.153-06','f7eaa8c3-e03d-4904-a987-2e4717bea4e0');

INSERT INTO public.profiles (id,"name",last_name,full_name,created_at,updated_at,user_id) VALUES
	 ('f7eaa8c3-e03d-4904-a987-2e4717bea4e0','Alberto','Sánchez Martínez','Alberto Sánchez Martínez','2023-01-31 16:39:18.138-06','2023-01-31 16:39:18.138-06','d6934380-9aca-11ed-9a73-ad2ecd89790f'),
	 ('94f8a3e4-558c-41f0-ad8d-2bd8ebde43c2','Vortex','Dev Ops','Vortex Dev Ops','2023-01-31 16:39:18.138-06','2023-02-01 11:43:40.425-06','36866b40-a0e4-11ed-be80-87a6daf5deaa'),
	 ('306d0d40-a314-11ed-8fbc-7fa7a206f049','Alberto','Sánchez Martínez','Alberto Sánchez Martínez','2023-02-02 10:11:02.549-06','2023-02-02 10:11:02.549-06','30556690-a314-11ed-8fbc-7fa7a206f049');

INSERT INTO public.user_roles (id,user_id,role_id,created_at,updated_at) VALUES
	 ('591b4f9a-d6d8-4e0d-ba08-1d85ef44ae53','d6934380-9aca-11ed-9a73-ad2ecd89790f','19e7fb40-a0e2-11ed-b16b-f79849cd9fd9','2023-01-31 16:39:18.264-06','2023-01-31 16:39:18.264-06'),
	 ('f591a770-a26a-11ed-99dd-a3d5812d012b','36866b40-a0e4-11ed-be80-87a6daf5deaa','1f34f210-a0e2-11ed-b16b-f79849cd9fd9','2023-02-01 13:59:38.856-06','2023-02-01 13:59:38.856-06'),
	 ('306cbf20-a314-11ed-8fbc-7fa7a206f049','30556690-a314-11ed-8fbc-7fa7a206f049','276d9720-a0e2-11ed-b16b-f79849cd9fd9','2023-02-02 10:11:02.546-06','2023-02-02 10:11:02.546-06');

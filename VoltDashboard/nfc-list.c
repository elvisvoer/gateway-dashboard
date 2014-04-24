/**
 * @file nfc-list.c
 * @brief Lists the first target present of each founded device
 */

#ifdef HAVE_CONFIG_H
#  include "config.h"
#endif // HAVE_CONFIG_H

#include <err.h>
#include <stdio.h>
#include <stddef.h>
#include <stdlib.h>
#include <string.h>

#include <unistd.h>
#include <sys/types.h>

#include <nfc/nfc.h>

#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <sys/sendfile.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <errno.h>

#include "nfc-utils.h"

#define MAX_DEVICE_COUNT 2
#define MAX_TARGET_COUNT 2

int client_socket;
struct sockaddr_in servaddr,cliaddr;
struct hostent *server;

void init_socket(char *serverName)
{
	client_socket=socket(AF_INET,SOCK_STREAM,0);
	if (client_socket< 0){
		perror("ERROR: opening socket\n");
		exit(0);
	}

	server = gethostbyname(serverName);
	if (server == NULL) {
		perror("ERROR: no such host\n");
		exit(0);
	}

	memset(&servaddr,0,sizeof(servaddr));
	servaddr.sin_family = AF_INET;
   	servaddr.sin_addr.s_addr=inet_addr(server->h_name);
   	servaddr.sin_port=htons(8124);
	if(connect(client_socket, (struct sockaddr *)&servaddr, sizeof(servaddr)) < 0)
	{	
		fprintf(stderr, "Cannot connect to socket\n");
		close(client_socket);
		exit(1);
	}

}


int
main(int argc, const char *argv[])
{
	int fd[2];
	char readbuffer[1000];
	pipe(fd);

	nfc_context *context;
	nfc_init(&context);
	
	size_t  i;
	int res = 0;
	bool verbose = false;
  
	if (context == NULL) {
		ERR("Unable to init libnfc (malloc)");
		exit(EXIT_FAILURE);
	}
  
	nfc_connstring connstrings[MAX_DEVICE_COUNT];
  
	size_t szDeviceFound = nfc_list_devices(context, connstrings, MAX_DEVICE_COUNT);
  
    if (szDeviceFound == 0) {
    	printf("No NFC device found.\n");
    }
	
	if (szDeviceFound !=0) {
		printf("%d devices found .\n" , szDeviceFound);	
	}
    
	
	nfc_modulation nm;
	nm.nmt = NMT_ISO14443A;
	nm.nbr = NBR_106;

	pid_t  childpid;
		
	  for (i = 0; i < szDeviceFound; i++) {
	  
		if ((childpid = fork()) == 0)  // child proccess
      	    	{

		   nfc_device *pnd;
		   close(fd[0]);
		   dup2(fd[1], 1);
//
//		   while(1)
//		   { //infinite loop in child
		   	nfc_target ant[MAX_TARGET_COUNT];
		   	pnd = nfc_open(context, connstrings[i]);
			if(pnd == NULL)
				printf("Unable to open device %s:\n", connstrings[i]);
	
		   //	nfc_initiator_init(pnd);
		   	nfc_target pant[MAX_TARGET_COUNT];

		while(1){
			nfc_initiator_init(pnd);
		   	res = nfc_initiator_list_passive_targets(pnd, nm, ant, MAX_TARGET_COUNT);
		   	int n;
		   	do {	
				for (n = 0; n < res; n++) {	
				if( memcmp((void*)&pant[n], (void*)&ant[n], sizeof(ant[n])) != 0)
		        	{
					printf("Reader number: %d\n",i);
					print_nfc_target(&ant[n], verbose);
					printf("\n");
				    	memcpy((void*)&pant[n], (void*)&ant[n], sizeof(ant[n]));
				}
			  	}
		  	} while (nfc_initiator_list_passive_targets(pnd, nm, ant, MAX_TARGET_COUNT) == 0);

//                        nfc_close(pnd);

                 }
		   i++; continue;
		} //outside fork
		else { printf("Fork: %d\n", childpid); }
		
	  }//end for
	  close(fd[1]);
	  int nbytes;
	  init_socket("127.0.0.1");
	  while(1)
//	  do
	  {
		memset(readbuffer, 0, sizeof(readbuffer));
	        // Read in a string from the pipe
                nbytes = read(fd[0], readbuffer, sizeof(readbuffer));
		if(nbytes > 0)
		{
			write(client_socket, readbuffer, strlen(readbuffer));
		}
//                sprintf(hugebuff, "echo '%s' >/dev/tcp/127.0.0.1/8124", readbuffer);
//		system(hugebuff);
		
	  }
//	  while(nbytes > 0);
//*/
}
 


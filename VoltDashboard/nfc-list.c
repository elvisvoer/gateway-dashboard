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

#include <nfc/nfc.h>

#include "nfc-utils.h"

#define MAX_DEVICE_COUNT 2
#define MAX_TARGET_COUNT 2


int
main(int argc, const char *argv[])
{
	(void) argc;
  
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
		   while(1){ //infinite loop in child
		   	nfc_target ant[MAX_TARGET_COUNT];
		   	pnd = nfc_open(context, connstrings[i]);
			if(pnd == NULL)
				printf("Unable to open device %s:\n", connstrings[i]);
	
		   	nfc_initiator_init(pnd);
		   	nfc_target pant[MAX_TARGET_COUNT];

		
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
		} //outside fork
		else { printf("Fork: %d\n",childpid); }
		
	  }//end for
	  
}
 


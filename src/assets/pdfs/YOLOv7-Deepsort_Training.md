# Method to annonate, organize and train YOLOv7 to use in combination with Deepsort.

## Written by Prasanth Suresh (ps32611@uga.edu).

To achieve a robust YOLOv7 model, it is recommended to train with over 1500 images per class, and more then 10,000 instances per class.

### Annotations:

There are several open-sorce packages available to annotate datasets and produce labels in YOLOv7 format. Some examples include: [Labelme](http://labelme.csail.mit.edu/Release3.0/), [Labelimg](https://github.com/heartexlabs/labelImg#Hotkeys), [Labelbox](https://labelbox.com/) and [Roboflow](https://roboflow.com/annotate).

For this tutorial, we're going to use Roboflow. This [official documentation](https://blog.roboflow.com/getting-started-with-roboflow/) explains how to use Roboflow to upload, organize and annotate your data. Once you're done annotating, use the "Generate" option on the left side panel to split the dataset into test, train and validation. Roboflow automatically suggests that you apply augmentations to the image and you can choose between a wide array of augmentations available. **Just be careful not to distort/crop/zoom too much so that the desiderata in the images become unrecognizable.**

Upon completion, you can choose to export the dataset to your local system in any of their available formats. Choose YOLOv7 under the TXT subsection.

In order to combine YOLOv7 and Deepsort, I used [this package](https://github.com/deshwalmahesh/yolov7-deepsort-tracking), however, some modifications have been made to the original YOLOv7 code in this package and it doesn't work for training YOLO.

### Organizing data for training:

YOLOv7 code accepts data in a specific format and for this, first save all the file names of the images from your train, test and val folders into seperate txt files. **Note that we're going to move all the images into a single folder (lets call it Images), before training, so make sure you can find-and-replace all the paths within each txt file to the location of the Images folder.**

I used the following code to save the filenames (don't forget to modify the paths and filenames in the below code), but feel free to use your own method:

        import os
        a = open("/home/psuresh/yolov7/train_labels.txt", "w")
        for path, subdirs, files in os.walk(r"/home/psuresh/yolov7/Images/train/images/"):
            for filename in files:
                if '.jpg' in filename:
                    f = os.path.join(path, filename)
                    a.write(str(f) + os.linesep) 

You should now have 3 seperate txt files train_labels.txt, test_labels.txt, val_labels.txt with the paths of images in the train, test and val folders respectively.

### Training YOLOv7:

For this, I used the official [YOLOv7 code](https://github.com/WongKinYiu/yolov7) and installed all the dependencies inside a custom conda environment using the requirements.txt file [available here](https://github.com/WongKinYiu/yolov7/blob/main/requirements.txt).

Now, download a sample weights file to start your training with from [this link](https://github.com/WongKinYiu/yolov7/releases/download/v0.1/yolov7_training.pt) and create a folder yolov7/weights and place it there.

3 seperate txt files we extracted in the previous section(train_labels.txt, test_labels.txt, val_labels.txt), place them in the parent folder yolov7/YOURTXTFILES.

Now move all the images and their corresponding labels from train, test and val folders into the yolov7/Images folder. **This is the part where you replace all the paths in YOURTXTFILES to say ./Images/WHATEVERIMAGEFILENAME.jpg.**

Next, we've to create two yaml files before we can start training. Go to yolov7/data/coco.yaml and copy all the contents into a new yaml file within the same folder (say coco_custom.yaml) and modify the following:

    - Comment out the 'download:' line since we don't want it to try and download a coco dataset.

    - Change the 'train:', 'val:' and 'test:' lines to contain the relative path of YOURTXTFILES.

    - Modify 'nc:' line to the number of classes in your data.

    - Similarly, modify the 'names:' line to contain your class labels.

Finally, go to yolov7/cfg/training/yolov7.yaml and copy paste everything into a new yaml file under yolov7/cfg/training (say yolov7_custom.yaml). Now modify the 'nc:' line to the number of classes in your data and you can leave the rest to be the same.

Now we're ready to start training. Open a terminal, cd to yolov7 folder (activate your custom conda env if you created one) and run the following command:

        python train.py --workers 8 --device 0 --batch-size 4 --data data/coco_custom.yaml --img 640 640 --cfg cfg/training/yolov7_custom.yaml --weights 'weights/yolov7_training.pt' --name yolov7_custom --hyp data/hyp.scratch.custom.yaml

If you want to leave it to train in the background without getting disconnected/interrupted, use:

        nohup python -u train.py --workers 8 --device 0 --batch-size 4 --data data/coco_custom.yaml --img 640 640 --cfg cfg/training/yolov7_custom.yaml --weights 'weights/yolov7_training.pt' --name yolov7_custom --hyp data/hyp.scratch.custom.yaml > training_results.txt &

Once it is done training, you can find the results in yolov7/training_results.txt and the trained weights inside yolov7/runs/train/YOUREXPTNAMELARGESTNUMBER/weights/best.pt.

### Deploying it with Deepsort:

To deploy the trained weights with YOLOv7-Deepsort combination, use [this package](https://github.com/deshwalmahesh/yolov7-deepsort-tracking) as mentioned before. There already is a pretrained model for deepsort [here](https://github.com/deshwalmahesh/yolov7-deepsort-tracking/blob/master/deep_sort/model_weights/mars-small128.pb) which works quite well for most problems. So you can directly open [this file](https://github.com/deshwalmahesh/yolov7-deepsort-tracking/blob/master/Colab%20Demo.ipynb) and modify the image/video names, paths and the weights filename to your files and run the Jupyter notebook to test your YOLOv7-Deepsort combined model.

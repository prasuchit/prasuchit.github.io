# Addressing the problem of camera extrinsic calibration using Hand-Eye Calibration technique.

## The following instructions are written for and tested on Ubuntu 20.04, ROS Noetic - Moveit1. 

## Written by Prasanth Suresh (ps32611@uga.edu).

### The problem:

As of today (07/20/22), this feature is only available on ROS-Noetic. This technique addresses the problem of finding the camera location wrt the world coordinate system based on the robot's transformation tree wrt the world origin and the calibration marker tag it sees in various poses.

It essentially solves the problem shown in the image below (in this scenario, the camera is attached to the end effector, but the camera could also be rigidly mounted somewhere):

![Hand-eye-calibration](https://user-images.githubusercontent.com/31422707/180013656-8c4e3b84-118a-4c7e-b744-3ecaa841d5c7.png)

If it is the above case, we move the endeffector, and by extension, the camera to view a steadily placed marker tag at a distance. If the camera is mounted elsewhere, we attach the marker stiffly to the endeffector and move the marker around so that the camera captures the marker in different poses.

Make sure to include more rotational angles in either case, that helps build more diverse input points and ergo a more accurate solution.

### The dependency problem:

While just cloning [moveit_calibration](https://github.com/ros-planning/moveit_calibration) package and resolving the dependencies using:

  `rosdep install -y --from-paths . --ignore-src --rosdistro noetic`
  
And building the package should get you setup, there are some things you need to be wary of:

1. If you're using realsense camera, rosdep install command above will try install the debian version of realsense driver. Cancel it or uninstall it once it finishes and make sure to use [this method](https://github.com/IntelRealSense/librealsense/blob/master/doc/distribution_linux.md#installing-the-packages) and check if the [versions match](https://github.com/IntelRealSense/realsense-ros/issues/2386#issuecomment-1177818564).
2. There's a broken library that the handeye calibration moveit plugin depends on. Uninstall everything related to libopenblas and instal from source [as mentioned here](https://github.com/ros-planning/moveit_calibration/issues/109#issuecomment-1040185628).

Now you're good to go! 

### The steps:

Since camera attached to hand (or eye-in-hand) has been explained in [these instructions](https://ros-planning.github.io/moveit_tutorials/doc/hand_eye_calibration/hand_eye_calibration_tutorial.html), I'm going to show the eye-to-hand case:

<img src="https://user-images.githubusercontent.com/31422707/180019267-750071ce-e9b2-4684-9444-7e5c171c0f68.jpg" alt="UR3e-view1" width="800" height="400">

<img src="https://user-images.githubusercontent.com/31422707/180019299-a8ea2392-6c90-4350-bcbb-ff577edb136a.jpg" alt="UR3e-view2" width="800" height="400">

To get the plugin up and running, the default [ros instructions](https://ros-planning.github.io/moveit_tutorials/doc/hand_eye_calibration/hand_eye_calibration_tutorial.html) will work. But follow the below settings(tested and verified):
![Calib-panel1](https://user-images.githubusercontent.com/31422707/180019687-857d43b7-074a-4447-87c1-ab4cc3f84083.png)
![Calib-panel2](https://user-images.githubusercontent.com/31422707/180019688-7f021088-c663-4475-8563-0063fe24e6c3.png)
![Calib-panel3](https://user-images.githubusercontent.com/31422707/180019692-e60b5682-cd8d-446f-8022-087ef1417d77.png)

Once you take 5 samples of the marker, the plugin should automatically print the camera transformation matrix to the terminal like this:

from base frame 'world'to sensor frame 'camera_link'

Reprojection error:

0.037348 m, 0.0282629 rad

[ INFO] [1658327615.156458109]: Publish camera transformation

 0.0525243  -0.998017  0.0346943  -0.224953
 
   0.87717  0.0627139   0.476067  -0.282496
   
 -0.477299 0.00542768   0.878724    1.34355
 
   0          0          0          1

Then you can use an online tool like [this one](https://www.energid.com/resources/orientation-calculator) to change from rotation matrix to roll-pitch-yaw angles and the first 3 values of the last column denote the x-y-z translations.



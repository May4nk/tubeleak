import random
from django.shortcuts import render,redirect
from django.urls import reverse
from .models import Owner,Upload,Comments,Subscribers
from django.contrib.auth import login,logout,authenticate
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from django.contrib import messages

def logn(req):
    if req.user.is_authenticated:
        return redirect('tube')
    if req.method == 'POST':
        usrname = req.POST['lusername']
        psswd = req.POST['lpassword']
        users = authenticate(req,username=usrname,password=psswd)
        if users is not None:
            login(req,users)
#            logged_in = redirect('home')
            #logged_in.set_cookie('usrname',usrname,max_age=60*60*20)
            return redirect('home')
        else:
            messages.info(req,'Username or password does not match...')
            return redirect('login')
    return render(req,'tleak/login.html')


def signup(req):
    if req.method == 'POST':
        usrname = req.POST['susername']
        psswd = req.POST['spass']
        cpsswd = req.POST['scpass']
        f_name = req.POST['sf_name']
        l_name = req.POST['sl_name']
        if l_name:
            name = f_name+' '+l_name
        else:
            name = f_name
        if psswd == cpsswd:
            if Owner.objects.filter(username=usrname):
                messages.info(req,'Username already got account...')
                return redirect(reverse('signup'))
            acc = Owner(name=name,username=usrname,password=cpsswd)
            if acc:
                acc.save()
                a = Owner.objects.get(username=usrname)
                a.set_password(cpsswd)
                a.save()
                return redirect('login')
        else:
            messages.info(req,"Passwords don't match...")
            return redirect(reverse('signup'))
    return render(req,'tleak/signup.html')


def anon_logn(req):
    if req.user.is_authenticated:
        return redirect('tube')
    else:
        if req.method == 'POST':
            rand = random.randint(0,99999)
            anon_username = 'anon'+str(rand)
            psswd = 'anon123'
            anon_acc = Owner(username=anon_username,name=anon_username,password=psswd,annon=True)
            if anon_acc:
                anon_acc.save()
                an = Owner.objects.get(username=anon_username)
                an.set_password(psswd)
                an.save()
                an_logn = authenticate(req,username=anon_username,password=psswd)
                if an_logn is not None:
                    login(req,an_logn)
                    return redirect('tube')
                else:
                    print('go')


            
def home(req):
    usr = req.user
    k=[]
    sub_own = Subscribers.objects.filter(sub_by=usr.username)
    for subs in sub_own:
        j = Upload.objects.filter(owner=subs.sub_to)
        for l in j:
            k.append(l)
    if len(k) == 0:
        k = Upload.objects.all()
    context = {
            'usr': usr,
            'home': k,
        }
    return render(req,'tleak/home.html',context)


def tube(req):
    usr = req.user
    uplod = Upload.objects.all()

    context= {
            'upload' : uplod,
            'usr': usr, 
        }
    return render(req,'tleak/tube.html',context)


def clipon(req):
    if req.user.is_authenticated:
        if req.method == 'POST':
            clip = req.POST['pclip']
            title = req.POST['ptitle']
            tag = req.POST['ptags']
            stags = tag.split(',')
            tags = '#'.join(stags)
            own = req.user.username
            cupload = Upload(video=clip,title=title,owner=own,pic=req.user,tags=tags)
            if cupload:
                cupload.save()
                return redirect('tube')

                
def search(req):
    usr = req.user
    context = {
            'usr':usr,
            }
    if req.method == 'POST':
        serch = req.POST.get('search')
        if serch[0] == '.':
            searched_clips = Upload.objects.filter(owner__contains=serch[1:])
        elif serch[0] == '#':
            searched_clips = Upload.objects.filter(tags__contains=serch[1:])
        else:
            searched_clips = Upload.objects.filter(title__contains=serch)
        context['clips'] = searched_clips
        context['srch'] = serch
        return render(req,'tleak/search.html',context)
    return render(req,'tleak/search.html',context) 


def clips(req,rid):
    usr = req.user
    vid = Upload.objects.get(id=rid)
    vid.views += 1
    vid.save()
    all_clips = Upload.objects.all()
    comments = Comments.objects.filter(cmnt_to = vid)
    context = {
        'usr': usr,
        'vid': vid,
        'all_clips': all_clips,
        'cmnts': comments,
            }
    return render(req,'tleak/clip.html',context)


def comment(req,cid):
    if req.user.is_authenticated:
        if req.method == 'POST':
            cmnt = req.POST['cmnt']
            cmnt_by = req.user.username
            cmnt_to = Upload.objects.get(id=cid)
            comm = Comments(cmnt=cmnt,cmnt_by=cmnt_by,cmnt_to=cmnt_to)
            if comm:
                comm.save()
                return redirect('clip',rid=cid)
    else:
        return redirect('login')


def trends(req):
    usr = req.user
    clips = Upload.objects.order_by('-views')
    context = {
        'clips': clips,
        'usr' : usr,
            }
    return render(req,'tleak/trending.html',context)


def profile(req,profname):
    usr = req.user
    
    if profname:
        try:
            uses = Owner.objects.get(username=profname)
            use = uses.username
            upload = Upload.objects.filter(owner=use)
        except ObjectDoesNotExist:
            uses = None
            use = profname
            upload = Upload.objects.filter(owner=use)
        finally:
            count_sub = Subscribers.objects.filter(sub_to=profname).count
            check_sub = Subscribers.objects.filter(sub_to=profname,sub_by=usr)
            sub = Subscribers.objects.filter(sub_by=usr)
            
            context={
                'usr':usr,
                'use':use,
                'uses':uses,
                'upload': upload,
                'check_sub': check_sub,
                'count_sub': count_sub,
                'sub': sub,
                }

    return render(req,'tleak/profile.html',context)


def prof_img(req,profile_img):
    if req.user.is_authenticated:
        if req.method == 'POST':
            img_url = req.POST['img']
            use = Owner.objects.get(id=req.user.id)
            if img_url:
                use.profile_pic = img_url
                use.save()
                return redirect('profile',profname=profile_img)


def subscribers(req,profile_sub):
    if req.method == 'POST':
        sub_to = req.POST['subs']
        sub_by = req.user.username
        subscribe = Subscribers(sub_to=sub_to,sub_by=sub_by,owner=Owner.objects.get(username=sub_to))
        if subscribe:
            subscribe.save()
            return redirect('profile',profname=profile_sub)


def unsubscribe(req,profile_unsub):
    if req.method == 'POST':
        sub_to = req.POST['subs']
        sub_by = req.user.username
        subscribe = Subscribers.objects.get(sub_to=sub_to,sub_by=sub_by)
        if subscribe:
            subscribe.delete()
            return redirect('profile',profname=profile_unsub)
    
        
def logut(req):
    if req.user.annon:
        Owner.objects.get(id=req.user.id).delete()
        logout(req)
    else:
        logout(req)
    logged_out = redirect('tube')
    return logged_out


def base(req):
    userr = req.user
    context={
        'usr': userr
            }
    return render(req,'base.html',context)
